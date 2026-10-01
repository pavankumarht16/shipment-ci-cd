import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import databaseUrl from "./database-url.js";

const useSsl =
    Boolean(process.env.VCAP_SERVICES) ||
    databaseUrl.includes("sslmode=require");

const adapter = new PrismaPg({
    connectionString: databaseUrl,
    ...(useSsl
        ? {
              ssl: {
                  rejectUnauthorized: false
              }
          }
        : {})
});

const prisma = new PrismaClient({
    adapter
});

export default prisma;