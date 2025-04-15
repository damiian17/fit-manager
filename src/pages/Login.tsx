
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoginHeader from "@/components/auth/LoginHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  getActiveSession, 
  hasClientProfile, 
  signUpWithPassword,
  signInWithPassword,
  signInWithGoogle
} from "@/utils/authUtils";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"trainer" | "client">("client");
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [trainerRegisterDialogOpen, setTrainerRegisterDialogOpen] = useState(false);
  const [trainerEmail, setTrainerEmail] = useState("");
  const [trainerPassword, setTrainerPassword] = useState("");
  const [trainerConfirmPassword, setTrainerConfirmPassword] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sesión...");
        const session = await getActiveSession();
        
        if (session) {
          console.log("Sesión activa encontrada:", session);
          
          // Guardar datos en localStorage
          localStorage.setItem('clientEmail', session.user.email || '');
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientUserId', session.user.id);
          
          // Verificar si el usuario tiene perfil
          const hasProfile = await hasClientProfile(session.user.id);
          console.log("¿El usuario tiene perfil?", hasProfile);
            
          // Si no tiene perfil, redirigir a completar registro, si lo tiene, al portal
          if (!hasProfile) {
            navigate("/client-register");
          } else {
            navigate("/client-portal");
          }
        } else {
          console.log("No hay sesión activa");
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent, role: "trainer" | "client" = activeTab) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Para entrenadores, verificamos en localStorage si están registrados
      if (role === "trainer") {
        const storedTrainers = JSON.parse(localStorage.getItem('registeredTrainers') || '[]');
        const trainer = storedTrainers.find((t: any) => t.email === email && t.password === password);
        
        if (trainer) {
          toast.success(`¡Bienvenido entrenador ${trainer.name}!`);
          localStorage.setItem('trainerLoggedIn', 'true');
          localStorage.setItem('trainerEmail', email);
          localStorage.setItem('trainerName', trainer.name);
          navigate("/dashboard");
          return;
        } else if (email === "admin" && password === "admin") {
          // Mantenemos la compatibilidad con el login admin/admin
          toast.success("¡Bienvenido entrenador administrador!");
          localStorage.setItem('trainerLoggedIn', 'true');
          localStorage.setItem('trainerEmail', 'admin');
          localStorage.setItem('trainerName', 'Administrador');
          navigate("/dashboard");
          return;
        } else {
          toast.error("Credenciales inválidas");
        }
      }
      
      // Para clientes, usamos autenticación de Supabase
      if (role === "client") {
        console.log("Intentando iniciar sesión con:", { email, password });
        
        const { user, session } = await signInWithPassword(email, password);

        if (user) {
          toast.success("¡Inicio de sesión exitoso!");
          
          // Guardar datos en localStorage
          localStorage.setItem('clientEmail', user.email || '');
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientUserId', user.id);
          
          console.log("Información de usuario guardada en localStorage:", {
            email: user.email,
            id: user.id
          });
          
          // Verificar si el usuario tiene perfil
          const hasProfile = await hasClientProfile(user.id);
          console.log("¿El usuario tiene perfil?", hasProfile);
            
          // Si no tiene perfil, redirigir a completar registro, si lo tiene, al portal
          if (!hasProfile) {
            navigate("/client-register");
          } else {
            navigate("/client-portal");
          }
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Error al iniciar sesión: ${error.message || "Inténtalo de nuevo"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRegisterDialog = () => {
    setRegisterDialogOpen(true);
  };

  const handleOpenTrainerRegisterDialog = () => {
    setTrainerRegisterDialogOpen(true);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // No necesitamos manejar la redirección aquí ya que es manejada por OAuth
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error(`Error al iniciar sesión con Google: ${error.message}`);
      setIsLoading(false);
    }
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

      // Usar la función de registro desde authUtils
      const { user, session } = await signUpWithPassword(registerEmail, registerPassword);

      console.log("Usuario registrado:", { user, session });

      if (user) {
        // Guardar el email para el registro del perfil y el ID para facilitar el registro
        localStorage.setItem('clientEmail', registerEmail);
        localStorage.setItem('clientLoggedIn', 'true');
        localStorage.setItem('clientUserId', user.id);
        
        console.log("Información de usuario guardada en localStorage:", {
          email: registerEmail,
          id: user.id
        });
        
        // Manejar el caso de registration_confirmed y registration_sent
        if (session) {
          // Si hay una sesión activa, usarla directamente
          toast.success("Cuenta creada correctamente. Ahora completa tu perfil.");
          setRegisterDialogOpen(false);
          navigate("/client-register");
        } else {
          // Si no hay sesión (confirmación pendiente), mostrar mensaje específico
          toast.success("Cuenta creada. Verifica tu email para confirmar tu cuenta (si es necesario).");
          setRegisterDialogOpen(false);
          navigate("/client-register");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Error al registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos
      if (!trainerEmail || !trainerPassword || !trainerName) {
        toast.error("Por favor completa todos los campos");
        setIsLoading(false);
        return;
      }

      if (trainerPassword !== trainerConfirmPassword) {
        toast.error("Las contraseñas no coinciden");
        setIsLoading(false);
        return;
      }

      // Guardar en localStorage
      const newTrainer = {
        email: trainerEmail,
        password: trainerPassword,
        name: trainerName,
        registeredAt: new Date().toISOString()
      };

      const storedTrainers = JSON.parse(localStorage.getItem('registeredTrainers') || '[]');
      
      // Verificar si el email ya está registrado
      if (storedTrainers.some((t: any) => t.email === trainerEmail)) {
        toast.error("Este email ya está registrado");
        setIsLoading(false);
        return;
      }
      
      // Agregar el nuevo entrenador y guardar
      storedTrainers.push(newTrainer);
      localStorage.setItem('registeredTrainers', JSON.stringify(storedTrainers));
      
      toast.success("Cuenta de entrenador creada correctamente");
      setTrainerRegisterDialogOpen(false);
      
      // Opcional: iniciar sesión automáticamente
      localStorage.setItem('trainerLoggedIn', 'true');
      localStorage.setItem('trainerEmail', trainerEmail);
      localStorage.setItem('trainerName', trainerName);
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Trainer registration error:", error);
      toast.error(`Error al registrar: ${error.message || "Inténtalo de nuevo"}`);
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
            defaultValue="client" 
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
              <CardContent className="space-y-4">
                <form onSubmit={(e) => handleLogin(e, "trainer")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainer-email">Email</Label>
                    <Input
                      id="trainer-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa tu email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainer-password">Contraseña</Label>
                    <Input
                      id="trainer-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Procesando..." : "Iniciar sesión"}
                  </Button>
                  
                  <p className="text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto" 
                      onClick={handleOpenTrainerRegisterDialog}
                    >
                      Regístrate como entrenador
                    </Button>
                  </p>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="client">
              <CardContent className="space-y-4">
                <form onSubmit={(e) => handleLogin(e, "client")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Contraseña</Label>
                    <Input
                      id="client-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Procesando..." : "Iniciar sesión"}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        o continúa con
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <p className="text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto" 
                      onClick={handleOpenRegisterDialog}
                    >
                      Regístrate
                    </Button>
                  </p>
                </form>
              </CardContent>
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

      {/* Dialog para registro de entrenadores */}
      <Dialog open={trainerRegisterDialogOpen} onOpenChange={setTrainerRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro de Entrenador</DialogTitle>
            <DialogDescription>
              Crea una cuenta para gestionar tus clientes, rutinas y dietas
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTrainerRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainerName">Nombre completo</Label>
              <Input
                id="trainerName"
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerEmail">Email</Label>
              <Input
                id="trainerEmail"
                type="email"
                value={trainerEmail}
                onChange={(e) => setTrainerEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerPassword">Contraseña</Label>
              <Input
                id="trainerPassword"
                type="password"
                value={trainerPassword}
                onChange={(e) => setTrainerPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerConfirmPassword">Confirmar Contraseña</Label>
              <Input
                id="trainerConfirmPassword"
                type="password"
                value={trainerConfirmPassword}
                onChange={(e) => setTrainerConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setTrainerRegisterDialogOpen(false)}>
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
