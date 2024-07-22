import { z } from "zod";

// auth
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export type SignIn = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
export type SignUp = z.infer<typeof SignUpSchema>;

// Project

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name is too long" }),
  description: z.string(),
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;

export const CreateFileSchema = z.object({
  path: z.string(),
  projectId: z.string(),
});

export type CreateFile = z.infer<typeof CreateFileSchema>;
