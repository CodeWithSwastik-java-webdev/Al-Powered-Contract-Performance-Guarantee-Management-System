import type { User } from "../generated/prisma/client";
import { userRepository } from "../repositories";
import { ConflictError, ForbiddenError, NotFoundError, hashPassword, verifyPassword } from "../utils";

export class AuthService {
  async registerUser(input: { name: string; email: string; password: string; department?: string; phone?: string }): Promise<User> {
    if (await userRepository.findByEmail(input.email)) throw new ConflictError("Email is already in use");
    return userRepository.create({ authIdentifier: `local:${input.email}`, passwordHash: await hashPassword(input.password), name: input.name, email: input.email, department: input.department, phone: input.phone });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) throw new NotFoundError("Invalid email or password.");
    if (!user.isActive || user.status !== "ACTIVE") throw new ForbiddenError(`Account status: ${user.status}`);
    if (user.lockedUntil && user.lockedUntil > new Date()) throw new ForbiddenError("Account is locked due to multiple failed login attempts.");
    return userRepository.updateLastLogin(user.id);
  }
}
export const authService = new AuthService();
