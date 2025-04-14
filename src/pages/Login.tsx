
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
  const [isRegistering, setIsRegistering] = useState(false);
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
          // Store client login status
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientEmail', email);
        }
      } else {
        // Check if it's a registered client
        const clients = JSON.parse(localStorage.getItem('fit-manager-clients') || '[]');
        const client = clients.find((c: any) => c.email === email);
        
        if (client && role === "client") {
          // Simple password check - in a real app, this would be properly hashed
          if (localStorage.getItem(`client-password-${email}`) === password) {
            toast.success(`¡Bienvenido ${client.name}!`);
            localStorage.setItem('clientLoggedIn', 'true');
            localStorage.setItem('clientEmail', email);
            navigate("/client-portal");
          } else {
            toast.error("Contraseña incorrecta");
          }
        } else {
          toast.error("Credenciales inválidas");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email and password
      if (!email || !password) {
        toast.error("Por favor ingresa un email y contraseña");
        return;
      }

      // Check if email is already registered
      const clients = JSON.parse(localStorage.getItem('fit-manager-clients') || '[]');
      const clientExists = clients.find((c: any) => c.email === email);
      
      if (clientExists) {
        toast.error("Este email ya está registrado");
        setIsLoading(false);
        return;
      }

      // Store the password (in a real app, this would be properly hashed)
      localStorage.setItem(`client-password-${email}`, password);
      localStorage.setItem('clientEmail', email);
      
      // Redirect to client registration form
      toast.success("Cuenta creada correctamente. Ahora completa tu perfil.");
      navigate("/client-register");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error al registrar. Inténtalo de nuevo.");
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
            <CardTitle className="text-2xl font-bold text-center">
              {isRegistering && activeTab === "client" ? "Registro de Cliente" : "Acceso a Fit Manager"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegistering && activeTab === "client" 
                ? "Crea una cuenta para acceder a tus rutinas y dietas personalizadas" 
                : "Ingresa tus credenciales para acceder al sistema"}
            </CardDescription>
          </CardHeader>
          <Tabs 
            defaultValue="trainer" 
            className="w-full" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value as "trainer" | "client");
              setIsRegistering(false);
            }}
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
              {isRegistering ? (
                <form onSubmit={handleRegister}>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                      <input
                        id="password"
                        type="password"
                        className="w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-fitBlue-600 text-white rounded hover:bg-fitBlue-700 transition"
                      disabled={isLoading}
                    >
                      {isLoading ? "Procesando..." : "Registrarme"}
                    </button>
                    <p className="text-center text-sm mt-4">
                      ¿Ya tienes cuenta?{" "}
                      <button
                        type="button"
                        className="text-fitBlue-600 hover:underline"
                        onClick={() => setIsRegistering(false)}
                      >
                        Iniciar sesión
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <LoginForm
                  role="client"
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isLoading={isLoading}
                  onLogin={handleLogin}
                  setActiveTab={setActiveTab}
                  onRegister={() => setIsRegistering(true)}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
