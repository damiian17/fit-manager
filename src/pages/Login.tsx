
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"trainer" | "client">("trainer");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Si ya hay una sesión activa, redirigir según el rol
        localStorage.setItem('clientEmail', session.user.email || '');
        localStorage.setItem('clientLoggedIn', 'true');
        navigate("/client-portal");
      }
    };
    
    checkSession();
  }, [navigate]);

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
        console.log("Intentando iniciar sesión con:", { email, password });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login error:", error);
          toast.error(`Error de inicio de sesión: ${error.message}`);
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

  const handleOpenRegisterDialog = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar email y contraseña
      if (!registerEmail || !registerPassword) {
        toast.error("Por favor ingresa un email y contraseña");
        setIsLoading(false);
        return;
      }

      if (registerPassword !== confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        setIsLoading(false);
        return;
      }

      console.log("Intentando registrar:", { email: registerEmail, password: registerPassword });

      // Crear usuario en Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      });

      if (error) {
        console.error("Registration error:", error);
        toast.error("Error al registrar: " + error.message);
        setIsLoading(false);
        return;
      }

      console.log("Usuario registrado:", data);

      // Si el usuario se ha registrado correctamente, iniciar sesión automáticamente
      if (data.user) {
        // Guardar el email para el registro del perfil
        localStorage.setItem('clientEmail', registerEmail);
        localStorage.setItem('clientLoggedIn', 'true');
        
        // Redirigir al formulario de registro de perfil
        toast.success("Cuenta creada correctamente. Ahora completa tu perfil.");
        setRegisterDialogOpen(false);
        navigate("/client-register");
      }
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
              Acceso a Fit Manager
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <Tabs 
            defaultValue="trainer" 
            className="w-full" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value as "trainer" | "client");
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
              <LoginForm
                role="client"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onLogin={handleLogin}
                setActiveTab={setActiveTab}
                onRegister={handleOpenRegisterDialog}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Dialog para registro de clientes */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro de Cliente</DialogTitle>
            <DialogDescription>
              Crea una cuenta para acceder a tus rutinas y dietas personalizadas
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registerEmail">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerPassword">Contraseña</Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Procesando..." : "Registrarme"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
