import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import * as schema from "./schema";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
  },
  // eslint-disable-next-line no-restricted-properties
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

const client = postgres(env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);
