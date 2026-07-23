import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../config";
type TokenPayload = { sub: string; exp: number };
const encode = (value: string) => Buffer.from(value).toString("base64url");
const signature = (input: string) => createHmac("sha256", env.JWT_SECRET).update(input).digest("base64url");
export function createAccessToken(userId: string): string {
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encode(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 }));
  return `${header}.${payload}.${signature(`${header}.${payload}`)}`;
}
export function readAccessToken(token: string): TokenPayload | null {
  const [header, payload, supplied] = token.split(".");
  if (!header || !payload || !supplied) return null;
  const expected = signature(`${header}.${payload}`);
  if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return null;
  try { const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as TokenPayload; return typeof parsed.sub === "string" && parsed.exp > Math.floor(Date.now() / 1000) ? parsed : null; } catch { return null; }
}
