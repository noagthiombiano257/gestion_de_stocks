import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_hM3seIvrJZ9l@ep-still-hall-aiyuhr2n-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
