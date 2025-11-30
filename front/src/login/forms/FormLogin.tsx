"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuSendHorizontal } from "react-icons/lu";
import { LoginInput, loginSchema } from "@/src/validators/user.validator";

interface FormLoginProps {
  onSubmit: (data: LoginInput) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function FormLogin({ onSubmit }: FormLoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      className="flex flex-col items-center gap-4 w-full max-w-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <input
          type="text"
          placeholder="Email"
          className={`input ${errors.email ? "border-red-500" : ""}`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="w-full">
        <input
          type="password"
          placeholder="Contraseña"
          className={`input ${errors.password ? "border-red-500" : ""}`}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button

        className="flex items-center justify-center gap-2 bg-[#10b981] pt-6 px-7"
        type="submit"
        disabled={isSubmitting}
      >
        <span>Iniciar Sesion</span>
        <LuSendHorizontal size={20} />
      </button>
    </form>
  );
}
