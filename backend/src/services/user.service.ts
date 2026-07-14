import { UserRole, type Prisma, type User } from "../generated/prisma/client";
import { userRepository } from "../repositories";
import type {
  ListUsersQuery,
  UpdateUserInput,
  UpdateUserRoleInput,
} from "../validators";
import type { PaginatedResult } from "../types";
import { ForbiddenError, NotFoundError } from "../utils";

export class UserService {
  async getById(id: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async getMe(userId: string): Promise<User> {
    return this.getById(userId);
  }

  async list(query: ListUsersQuery): Promise<PaginatedResult<User>> {
    const { page, limit, role, isActive, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { department: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const { items, total } = await userRepository.findMany({
      skip,
      take: limit,
      where,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    input: UpdateUserInput,
    actor: User,
  ): Promise<User> {
    await this.getById(id);

    if (actor.id !== id && actor.role !== UserRole.ADMIN) {
      throw new ForbiddenError("You can only update your own profile");
    }

    if (input.isActive !== undefined && actor.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only administrators can change account status");
    }

    if (actor.id === id && input.isActive === false) {
      throw new ForbiddenError("You cannot deactivate your own account");
    }

    return userRepository.update(id, input);
  }

  async updateRole(
    id: string,
    input: UpdateUserRoleInput,
    actor: User,
  ): Promise<User> {
    const target = await this.getById(id);

    if (actor.id === id) {
      throw new ForbiddenError("You cannot change your own role");
    }

    if (target.role === input.role) {
      return target;
    }

    return userRepository.updateRole(id, input.role);
  }

  async unlock(id: string, actor: User): Promise<User> {
    // only admin
    if (actor.role !== UserRole.ADMIN) throw new ForbiddenError('Only admins can unlock accounts')
    await this.getById(id)
    return userRepository.update(id, { failedLoginAttempts: 0, lockedUntil: null, isActive: true })
  }
}

export const userService = new UserService();
