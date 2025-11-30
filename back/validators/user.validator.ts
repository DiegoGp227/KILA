import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string({ message: "El nombre de usuario es requerido" })
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .max(50, { message: "El nombre de usuario no puede exceder 50 caracteres" })
    .trim(),

  email: z
    .string({ message: "El email es requerido" })
    .email({ message: "Formato de email inválido" })
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "El email es requerido" })
    .email({ message: "Formato de email inválido" })
    .toLowerCase()
    .trim(),

  password: z.string({ message: "La contraseña es requerida" }),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres")
    .trim()
    .optional(),

  email: z.string().email("Formato de email inválido").toLowerCase().trim(),

  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
