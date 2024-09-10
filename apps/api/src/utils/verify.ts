import type { onRequestHookHandler } from "fastify";

export const verifyApiKey: onRequestHookHandler = async (request) => {
  await request.jwtVerify();
};