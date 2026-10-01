import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import databaseUrl from "./database-url.js";

const adapter = new PrismaPg({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

const prisma = new PrismaClient({
    adapter
});

export default prisma;