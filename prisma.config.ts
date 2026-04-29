// Prisma 7 config. Loads .env so the CLI sees DATABASE_URL / DIRECT_URL —
// v7 doesn't auto-load .env anymore (you opt in via dotenv/config or Bun).
//
// v7 also moved the datasource URL out of schema.prisma — it lives here
// (single source of truth). At runtime, PrismaClient won't auto-read these
// either; we'll pass a Neon adapter to the constructor when app code starts
// querying. Migrations don't need the adapter.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
    directUrl: process.env["DIRECT_URL"],
  },
});
