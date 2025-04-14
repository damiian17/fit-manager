
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  role: "trainer" | "client";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onLogin: (e: React.FormEvent, role: "trainer" | "client") => Promise<void>;
  setActiveTab: (tab: "trainer" | "client") => void;
  onRegister?: () => void;
}

const LoginForm = ({
  role,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onLogin,
  setActiveTab,
  onRegister,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email.trim()) {
      toast.error("Por favor, introduce tu email");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Por favor, introduce tu contraseña");
      return;
    }
    
    // Llamar a la función de inicio de sesión
    await onLogin(e, role);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor={`email-${role}`}>Email</Label>
          <Input
            id={`email-${role}`}
            type="email"
            placeholder={role === "trainer" ? "entrenador@gimnasio.com" : "cliente@ejemplo.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`password-${role}`}>Contraseña</Label>
            <Link
              to="/forgot-password"
              className="text-sm text-fitBlue-600 hover:text-fitBlue-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id={`password-${role}`}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button
          type="submit"
          className="w-full bg-fitBlue-600 hover:bg-fitBlue-700"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
        {role === "trainer" ? (
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-fitBlue-600 hover:text-fitBlue-700 font-medium">
              Regístrate
            </Link>
          </div>
        ) : (
          <div className="mt-4 text-center text-sm">
            {onRegister ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-fitBlue-600 hover:text-fitBlue-700 font-medium"
                  onClick={onRegister}
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Eres entrenador?{" "}
                <button
                  type="button"
                  className="text-fitBlue-600 hover:text-fitBlue-700 font-medium"
                  onClick={() => setActiveTab("trainer")}
                >
                  Ingresa como entrenador
                </button>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </form>
  );
};

export default LoginForm;
