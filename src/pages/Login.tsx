
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent, role: "trainer" | "client") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would validate the credentials against a backend
      console.log(`Logging in as ${role} with email: ${email}`);

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Normally, you would check the response from your API
      if (email && password) {
        toast.success(`¡Bienvenido ${role === "trainer" ? "entrenador" : "cliente"}!`);
        navigate("/dashboard");
      } else {
        toast.error("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-fitBlue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-10 w-10 text-fitBlue-600" />
            <h1 className="text-3xl font-bold text-fitBlue-800">Fit Manager</h1>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Acceso a Fit Manager</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="trainer" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="trainer">Entrenador</TabsTrigger>
              <TabsTrigger value="client">Cliente</TabsTrigger>
            </TabsList>
            <TabsContent value="trainer">
              <form onSubmit={(e) => handleLogin(e, "trainer")}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-trainer">Email</Label>
                    <Input
                      id="email-trainer"
                      type="email"
                      placeholder="entrenador@gimnasio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-trainer">Contraseña</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-fitBlue-600 hover:text-fitBlue-700"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-trainer"
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
                  <div className="mt-4 text-center text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-fitBlue-600 hover:text-fitBlue-700 font-medium">
                      Regístrate
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="client">
              <form onSubmit={(e) => handleLogin(e, "client")}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-client">Email</Label>
                    <Input
                      id="email-client"
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-client">Contraseña</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-fitBlue-600 hover:text-fitBlue-700"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-client"
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
                  <div className="mt-4 text-center text-sm">
                    ¿Eres entrenador?{" "}
                    <button
                      type="button"
                      className="text-fitBlue-600 hover:text-fitBlue-700 font-medium"
                      onClick={() => document.querySelector('[data-state="inactive"][data-value="trainer"]')?.click()}
                    >
                      Ingresa como entrenador
                    </button>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
