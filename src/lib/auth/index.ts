import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Configure via environment when implementing
    // url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
});
