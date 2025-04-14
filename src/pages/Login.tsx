
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

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
      // Verificamos credenciales de administrador (para entrenadores)
      if (role === "trainer" && email === "admin" && password === "admin") {
        toast.success("¡Bienvenido entrenador!");
        navigate("/dashboard");
        return;
      }
      
      // Para clientes, usamos autenticación de Supabase
      if (role === "client") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login error:", error);
          toast.error("Credenciales inválidas. Por favor, verifica tu email y contraseña.");
          return;
        }

        if (data.user) {
          toast.success("¡Inicio de sesión exitoso!");
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientEmail', email);
          navigate("/client-portal");
          return;
        }
      } else {
        // Mensaje para credenciales incorrectas de entrenador
        toast.error("Credenciales inválidas");
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
      // Validar email y contraseña
      if (!email || !password) {
        toast.error("Por favor ingresa un email y contraseña");
        setIsLoading(false);
        return;
      }

      // Verificar si el correo ya está registrado en Supabase
      const { data: existingUsers, error: checkError } = await supabase
        .from('clients')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingUsers) {
        toast.error("Este email ya está registrado");
        setIsLoading(false);
        return;
      }

      // Crear usuario en Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Registration error:", error);
        toast.error("Error al registrar: " + error.message);
        setIsLoading(false);
        return;
      }

      // Guardar el email para el registro del perfil
      localStorage.setItem('clientEmail', email);
      
      // Redirigir al formulario de registro de perfil
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
