import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  userAgent: z.string().optional(),
});

export const RegisterSchema = LoginSchema.extend({
  image: z.string(),
});
