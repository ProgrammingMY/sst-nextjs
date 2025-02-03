import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "@/drizzle/app-schema";

const connection = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connection, { prepare: false })

export const db = drizzle(client, { schema });
