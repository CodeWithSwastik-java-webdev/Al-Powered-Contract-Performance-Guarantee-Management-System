import type { User } from "../generated/prisma/client";
import { userRepository } from "../repositories";
import type { RegisterUserInput } from "../validators";
import { ConflictError, NotFoundError } from "../utils";

export class AuthService {
  async registerUser(
    firebaseUid: string,
    input: RegisterUserInput,
  ): Promise<User> {
    const existingByUid = await userRepository.findByFirebaseUid(firebaseUid);
    if (existingByUid) {
      throw new ConflictError("User already registered");
    }

    const existingByEmail = await userRepository.findByEmail(input.email);
    if (existingByEmail) {
      throw new ConflictError("Email is already in use");
    }

    return userRepository.create({
      firebaseUid,
      name: input.name,
      email: input.email,
      department: input.department,
      phone: input.phone,
    });
  }

  async syncLogin(firebaseUid: string): Promise<User> {
    const user = await userRepository.findByFirebaseUid(firebaseUid);

    if (!user) {
      throw new NotFoundError("User not found. Complete registration first.");
    }

    return userRepository.updateLastLogin(user.id);
  }
}

export const authService = new AuthService();
