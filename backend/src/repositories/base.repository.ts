import type { PrismaClient } from "../generated/prisma/client";
import { prisma } from "../prisma/client";

export abstract class BaseRepository {
  protected readonly db: PrismaClient;

  constructor(db: PrismaClient = prisma) {
    this.db = db;
  }
}
