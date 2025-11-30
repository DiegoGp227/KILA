import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { signupSchema } from "../../validators/user.validator";
import { ValidationError, AppError } from "../../erros/appError";
import { InternalServerError } from "../../erros/500Errors";
import * as UserService from "../../services/auth/auth.services";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.issues.reduce((acc: Record<string, string>, err: any) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      }, {});

      throw new ValidationError("Validation errors", errors);
    }

    const user = await UserService.createUser(validation.data);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: (process.env.TOKEN_EXPIRATION || "1h") as string,
      } as SignOptions
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: user.id,
      token,
      userInfo: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error en signup:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Error interno del servidor");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
