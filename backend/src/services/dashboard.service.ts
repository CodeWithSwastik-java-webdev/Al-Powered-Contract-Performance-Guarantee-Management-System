import { prisma } from "../prisma/client";

export class DashboardService {
  async getStats() {
    const activeContracts = await prisma.contract.count({
      where: { status: "ACTIVE" },
    });

    const activeCpgsCount = await prisma.cpg.count({
      where: { status: "ACTIVE" },
    });

    const cpgAggregation = await prisma.cpg.aggregate({
      where: { status: "ACTIVE" },
      _sum: {
        amount: true,
      },
    });

    const totalCpgValue = cpgAggregation._sum.amount || 0;

    const riskAggregation = await prisma.riskAssessment.aggregate({
      _avg: {
        healthScore: true,
      },
    });

    const avgHealthScore = riskAggregation._avg.healthScore || 100;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoonCount = await prisma.cpg.count({
      where: {
        status: "ACTIVE",
        expiryDate: {
          lte: thirtyDaysFromNow,
        },
      },
    });

    const activeAnomaliesCount = await prisma.riskAssessment.count({
      where: {
        anomalyDetected: true,
        cpg: {
          status: "ACTIVE",
        },
      },
    });

    return {
      activeContracts,
      activeCpgs: activeCpgsCount,
      totalCpgValue,
      avgHealthScore,
      expiringSoon: expiringSoonCount,
      activeAnomalies: activeAnomaliesCount,
    };
  }

  async getRecentActivity() {
    return prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    });
  }

  async getCharts() {
    // Risk Distribution
    const activeCpgs = await prisma.cpg.findMany({
      where: { status: "ACTIVE" },
      include: {
        riskAssessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const riskDistribution = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    for (const cpg of activeCpgs) {
      if (cpg.riskAssessments.length > 0) {
        const level = cpg.riskAssessments[0].riskLevel;
        riskDistribution[level] = (riskDistribution[level as keyof typeof riskDistribution] || 0) + 1;
      } else {
        riskDistribution.LOW += 1; // Default
      }
    }

    const riskChart = Object.keys(riskDistribution).map((name) => ({
      name,
      value: riskDistribution[name as keyof typeof riskDistribution],
    }));

    // Status Breakdown
    const statusCounts = await prisma.cpg.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusChart = statusCounts.map((item) => ({
      name: item.status,
      value: item._count.id,
    }));

    // Monthly Expirations
    // Grouping by month natively is complex in Prisma depending on DB, so we'll do it in JS for now
    const upcomingCpgs = await prisma.cpg.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        expiryDate: true,
      },
    });

    const monthlyMap: Record<string, number> = {};
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
    for (const cpg of upcomingCpgs) {
      const monthStr = formatter.format(cpg.expiryDate);
      monthlyMap[monthStr] = (monthlyMap[monthStr] || 0) + 1;
    }

    const monthlyChart = Object.keys(monthlyMap).map((name) => ({
      name,
      value: monthlyMap[name],
    }));

    // Sort by actual date if needed, but simple for now
    return {
      riskDistribution: riskChart,
      statusBreakdown: statusChart,
      monthlyExpirations: monthlyChart,
    };
  }

  async getExpiringSoon() {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    return prisma.cpg.findMany({
      where: {
        status: "ACTIVE",
        expiryDate: {
          lte: ninetyDaysFromNow,
        },
      },
      orderBy: { expiryDate: "asc" },
      take: 10,
      include: {
        contract: {
          select: { contractNumber: true, projectName: true },
        },
      },
    });
  }
}

export const dashboardService = new DashboardService();
