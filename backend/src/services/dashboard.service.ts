import type { User } from "../generated/prisma/client";
import { UserRole } from "../generated/prisma/client";
import { prisma } from "../prisma/client";

function contractorScope(user: User) {
  if (user.role === UserRole.CONTRACTOR) {
    if (!user.contractorId) {
      return { contractorId: "__none__" };
    }
    return { contractorId: user.contractorId };
  }
  return {};
}

function cpgContractorFilter(user: User) {
  if (user.role === UserRole.CONTRACTOR) {
    if (!user.contractorId) {
      return { contract: { contractorId: "__none__" } };
    }
    return { contract: { contractorId: user.contractorId } };
  }
  return {};
}

export class DashboardService {
  async getStats(user: User) {
    const contractWhere = contractorScope(user);
    const cpgWhere = cpgContractorFilter(user);

    const activeContracts = await prisma.contract.count({
      where: { status: "ACTIVE", ...contractWhere },
    });

    const completedContracts = await prisma.contract.count({
      where: { status: "COMPLETED", ...contractWhere },
    });

    const totalContracts = await prisma.contract.count({
      where: { ...contractWhere },
    });

    const activeCpgsCount = await prisma.cpg.count({
      where: { status: "ACTIVE", ...cpgWhere },
    });

    const releasedCpgs = await prisma.cpg.count({
      where: { status: "RELEASED", ...cpgWhere },
    });

    const pendingVerificationCpgs = await prisma.cpg.count({
      where: {
        status: { in: ["SUBMITTED", "REQUIRED", "VERIFIED"] },
        ...cpgWhere,
      },
    });

    const cpgAggregation = await prisma.cpg.aggregate({
      where: { status: "ACTIVE", ...cpgWhere },
      _sum: { amount: true },
    });

    const totalCpgValue = cpgAggregation._sum.amount || 0;

    const riskAggregation = await prisma.riskAssessment.aggregate({
      where: Object.keys(cpgWhere).length
        ? { cpg: cpgWhere }
        : undefined,
      _avg: { healthScore: true },
    });

    const avgHealthScore = riskAggregation._avg.healthScore || 100;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoonCount = await prisma.cpg.count({
      where: {
        status: "ACTIVE",
        expiryDate: { lte: thirtyDaysFromNow },
        ...cpgWhere,
      },
    });

    const activeAnomaliesCount = await prisma.riskAssessment.count({
      where: {
        anomalyDetected: true,
        cpg: { status: "ACTIVE", ...cpgWhere },
      },
    });

    const base = {
      activeContracts,
      completedContracts,
      totalContracts,
      activeCpgs: activeCpgsCount,
      releasedCpgs,
      pendingVerificationCpgs,
      totalCpgValue,
      avgHealthScore,
      expiringSoon: expiringSoonCount,
      activeAnomalies: activeAnomaliesCount,
    };

    if (user.role === UserRole.ADMIN) {
      const [
        pendingRegistrations,
        totalUsers,
        totalContractors,
        notificationsUnread,
      ] = await Promise.all([
        prisma.registrationRequest.count({
          where: { status: "PENDING_APPROVAL" },
        }),
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.contractor.count(),
        prisma.notification.count({
          where: { userId: user.id, isRead: false },
        }),
      ]);

      return {
        ...base,
        pendingRegistrations,
        totalUsers,
        totalContractors,
        notificationsUnread,
      };
    }

    if (user.role === UserRole.CONTRACTOR) {
      const profileComplete = Boolean(
        user.name && user.email && user.phone && user.contractorId,
      );
      return {
        ...base,
        profileComplete,
        contractorId: user.contractorId,
      };
    }

    return base;
  }

  async getRecentActivity(user: User) {
    if (user.role === UserRole.CONTRACTOR && user.contractorId) {
      const contractIds = (
        await prisma.contract.findMany({
          where: { contractorId: user.contractorId },
          select: { id: true },
        })
      ).map((c) => c.id);

      const cpgIds = (
        await prisma.cpg.findMany({
          where: { contractId: { in: contractIds } },
          select: { id: true },
        })
      ).map((c) => c.id);

      return prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        where: {
          OR: [
            { entityType: "CONTRACT", entityId: { in: contractIds } },
            { entityType: "CPG", entityId: { in: cpgIds } },
          ],
        },
        include: {
          user: { select: { name: true, role: true } },
        },
      });
    }

    return prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, role: true } },
      },
    });
  }

  async getCharts(user: User) {
    const cpgWhere = cpgContractorFilter(user);

    const activeCpgs = await prisma.cpg.findMany({
      where: { status: "ACTIVE", ...cpgWhere },
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
        const level = cpg.riskAssessments[0]!.riskLevel;
        riskDistribution[level] =
          (riskDistribution[level as keyof typeof riskDistribution] || 0) + 1;
      } else {
        riskDistribution.LOW += 1;
      }
    }

    const riskChart = Object.keys(riskDistribution).map((name) => ({
      name,
      value: riskDistribution[name as keyof typeof riskDistribution],
    }));

    const statusCounts = await prisma.cpg.groupBy({
      by: ["status"],
      where: { ...cpgWhere },
      _count: { id: true },
    });

    const statusChart = statusCounts.map((item) => ({
      name: item.status,
      value: item._count.id,
    }));

    const upcomingCpgs = await prisma.cpg.findMany({
      where: { status: "ACTIVE", ...cpgWhere },
      select: { expiryDate: true },
    });

    const monthlyMap: Record<string, number> = {};
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    });
    for (const cpg of upcomingCpgs) {
      const monthStr = formatter.format(cpg.expiryDate);
      monthlyMap[monthStr] = (monthlyMap[monthStr] || 0) + 1;
    }

    const monthlyChart = Object.keys(monthlyMap).map((name) => ({
      name,
      value: monthlyMap[name],
    }));

    return {
      riskDistribution: riskChart,
      statusBreakdown: statusChart,
      monthlyExpirations: monthlyChart,
    };
  }

  async getExpiringSoon(user: User) {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    const cpgWhere = cpgContractorFilter(user);

    return prisma.cpg.findMany({
      where: {
        status: "ACTIVE",
        expiryDate: { lte: ninetyDaysFromNow },
        ...cpgWhere,
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
