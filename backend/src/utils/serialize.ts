import type { Prisma } from "../generated/prisma/client";

export function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(value, (_key, val) =>
      val !== null && typeof val === "object" && "toJSON" in val
        ? val
        : val,
    ),
  ) as Prisma.InputJsonValue;
}
