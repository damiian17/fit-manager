
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"trainer" | "client">("trainer");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent, role: "trainer" | "client") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // En un caso real, validarías las credenciales contra un backend
      console.log(`Logging in as ${role} with email: ${email}`);

      // Simulando llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificamos si las credenciales son "admin"
      if (email === "admin" && password === "admin") {
        toast.success(`¡Bienvenido ${role === "trainer" ? "entrenador" : "cliente"}!`);
        
        // Redirigimos según el rol
        if (role === "trainer") {
          navigate("/dashboard");
        } else {
          navigate("/client-portal");
        }
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
        <LoginHeader />

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Acceso a Fit Manager</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <Tabs 
            defaultValue="trainer" 
            className="w-full" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "trainer" | "client")}
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="trainer">Entrenador</TabsTrigger>
              <TabsTrigger value="client">Cliente</TabsTrigger>
            </TabsList>
            <TabsContent value="trainer">
              <LoginForm
                role="trainer"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onLogin={handleLogin}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
            <TabsContent value="client">
              <LoginForm
                role="client"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onLogin={handleLogin}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
