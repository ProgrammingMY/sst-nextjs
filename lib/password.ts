"use server";

import { hash, verify } from "@node-rs/argon2";

export async function saltAndHashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await verify(hash, password);
}
