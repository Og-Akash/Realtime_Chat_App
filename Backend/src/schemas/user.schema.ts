import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  profileImage: z.string()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export { registerSchema, loginSchema };