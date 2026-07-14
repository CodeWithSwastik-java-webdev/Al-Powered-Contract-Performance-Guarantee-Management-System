import type { Prisma, RegistrationRequest, RegistrationComment } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class RegistrationRepository extends BaseRepository {
  async findById(id: string): Promise<RegistrationRequest | null> {
    return this.db.registrationRequest.findUnique({
      where: { id },
      include: { comments: { include: { author: true } } },
    });
  }

  async findByEmail(email: string): Promise<RegistrationRequest | null> {
    return this.db.registrationRequest.findUnique({ where: { email } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RegistrationRequestWhereInput;
    orderBy?: Prisma.RegistrationRequestOrderByWithRelationInput;
  }): Promise<{ items: RegistrationRequest[]; total: number }> {
    const [items, total] = await Promise.all([
      this.db.registrationRequest.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy ?? { createdAt: "desc" },
      }),
      this.db.registrationRequest.count({ where: params.where }),
    ]);

    return { items, total };
  }

  async create(data: Prisma.RegistrationRequestCreateInput): Promise<RegistrationRequest> {
    return this.db.registrationRequest.create({ data });
  }

  async update(id: string, data: Prisma.RegistrationRequestUpdateInput): Promise<RegistrationRequest> {
    return this.db.registrationRequest.update({ where: { id }, data });
  }

  async addComment(requestId: string, authorId: string, content: string): Promise<RegistrationComment> {
    return this.db.registrationComment.create({
      data: {
        requestId,
        authorId,
        content,
      },
    });
  }
}

export const registrationRepository = new RegistrationRepository();
