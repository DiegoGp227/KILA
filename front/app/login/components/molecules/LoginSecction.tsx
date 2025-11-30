import FormLogin from "@/src/login/forms/FormLogin";
import useAuthUser from "@/src/login/services/hooks/useAuthUser";
import { LoginInput } from "@/src/validators/user.validator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import kila from "@/public/Lika Corto.png";

export default function LoginSecction() {
  const { login: loginUser, isLoading, error } = useAuthUser();
  const router = useRouter();

  const handleLogin = async (data: LoginInput) => {
    const response = await loginUser(data);
    if (response) {
      console.log("Usuario registrado/logueado:", response);
      router.push("/");
    } else {
      console.error("Error al registrar/loguear usuario:", error);
    }
  };
  return (
    <div className="flex items-center justify-center p-12 bg-[var(--bg-primary)] w-[50%] flex-col  gap-4">
      <div className="w-full max-w-[480px] flex justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-3">
          <Image src={kila} alt="Kila" width={100} height={100} />
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            KILA
          </h1>
          <p className="text-secondary-400 text-sm">
            Validador de Facturas DIAN
          </p>
        </div>
      </div>

      <FormLogin onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
}
