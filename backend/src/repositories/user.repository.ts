import type { Prisma, User, UserRole } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { firebaseUid } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ items: User[]; total: number }> {
    const [items, total] = await Promise.all([
      this.db.user.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy ?? { createdAt: "desc" },
      }),
      this.db.user.count({ where: params.where }),
    ]);

    return { items, total };
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({ where: { id }, data });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async deactivate(id: string): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const userRepository = new UserRepository();
