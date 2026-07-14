import type { Prisma, LoginActivity } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class LoginActivityRepository extends BaseRepository {
  async create(data: Prisma.LoginActivityCreateInput): Promise<LoginActivity> {
    return this.db.loginActivity.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.LoginActivityWhereInput;
    orderBy?: Prisma.LoginActivityOrderByWithRelationInput;
  }): Promise<{ items: LoginActivity[]; total: number }> {
    const [items, total] = await Promise.all([
      this.db.loginActivity.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy ?? { loginTime: "desc" },
      }),
      this.db.loginActivity.count({ where: params.where }),
    ]);

    return { items, total };
  }

  async getRecentFailedAttempts(email: string, since: Date): Promise<number> {
    return this.db.loginActivity.count({
      where: {
        email,
        isSuccessful: false,
        loginTime: { gte: since },
      },
    });
  }

  async updateLogout(id: string): Promise<LoginActivity> {
    return this.db.loginActivity.update({
      where: { id },
      data: { logoutTime: new Date() },
    });
  }
}

export const loginActivityRepository = new LoginActivityRepository();
