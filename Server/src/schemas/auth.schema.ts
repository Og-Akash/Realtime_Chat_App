import { z } from "zod";

export const emailSchema = z.string().email();

export const passwordSchema = z.string().min(6).max(255);

export const verificationCodeSchema = z.string().min(1).max(24);

export const LoginSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const RegisterSchema = LoginSchema.extend({
  image: z.string(),
});

export const resetPasswordSchema = z.object({
  code: verificationCodeSchema,
  password: passwordSchema,
});
