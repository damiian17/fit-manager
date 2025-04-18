
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
  signInWithGoogle,
  saveTrainerProfile,
  signOut
} from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    const cleanupPreviousSessions = async () => {
      const keysToClean = [
        'sb-yehxlphlddyzrnewfelr-auth-token',
        'clientLoggedIn',
        'clientEmail',
        'clientUserId',
        'trainerLoggedIn',
        'trainerEmail',
        'trainerName'
      ];
      
      const session = await getActiveSession();
      
      if (!session) {
        keysToClean.forEach(key => localStorage.removeItem(key));
        console.log("Datos de sesión local limpiados preventivamente en Login");
      }
    };
    
    cleanupPreviousSessions();
    
    const checkSession = async () => {
      try {
        console.log("Verificando sesión...");
        const session = await getActiveSession();
        
        if (session) {
          console.log("Sesión activa encontrada:", session);
          
          localStorage.setItem('clientEmail', session.user.email || '');
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientUserId', session.user.id);
          
          const hasProfile = await hasClientProfile(session.user.id);
          console.log("¿El usuario tiene perfil?", hasProfile);
            
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

  const clearAllLocalData = async () => {
    try {
      // 1. Intentar cerrar sesión primero en Supabase
      await supabase.auth.signOut();
      
      // 2. Eliminar todos los datos de localStorage
      localStorage.clear();
      
      // 3. Eliminar cookies específicas de Supabase
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('sb-')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // 4. Verificar si hay algún ítem específico que pueda estar causando problemas
      localStorage.removeItem('sb-yehxlphlddyzrnewfelr-auth-token');
      localStorage.removeItem('clientLoggedIn');
      localStorage.removeItem('clientEmail');
      localStorage.removeItem('clientUserId');
      localStorage.removeItem('trainerLoggedIn');
      localStorage.removeItem('trainerEmail');
      localStorage.removeItem('trainerName');
      
      // 5. Recargar la página para asegurar que se limpien todas las variables de estado
      toast.success("Datos locales eliminados correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al limpiar datos locales:", error);
      toast.error("Error al limpiar datos locales");
    }
  };

  const handleLogin = async (e: React.FormEvent, role: "trainer" | "client" = activeTab) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === "trainer") {
        try {
          const { user, session } = await signInWithPassword(email, password);
          
          if (!user) {
            toast.error("Credenciales de entrenador inválidas");
            setIsLoading(false);
            return;
          }
          
          const { data, error } = await supabase
            .from('trainers')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error || !data) {
            toast.error("No tienes perfil de entrenador");
            setIsLoading(false);
            return;
          }
          
          toast.success(`¡Bienvenido entrenador ${data.name}!`);
          localStorage.setItem('trainerLoggedIn', 'true');
          localStorage.setItem('trainerEmail', email);
          localStorage.setItem('trainerName', data.name);
          navigate("/dashboard");
        } catch (authError: any) {
          toast.error(`Error al iniciar sesión: ${authError.message}`);
          setIsLoading(false);
          return;
        }
      }
      
      if (role === "client") {
        console.log("Intentando iniciar sesión con:", { email, password });
        
        try {
          const { user, session } = await signInWithPassword(email, password);

          if (user) {
            toast.success("¡Inicio de sesión exitoso!");
            
            localStorage.setItem('clientEmail', user.email || '');
            localStorage.setItem('clientLoggedIn', 'true');
            localStorage.setItem('clientUserId', user.id);
            
            console.log("Información de usuario guardada en localStorage:", {
              email: user.email,
              id: user.id
            });
            
            const hasProfile = await hasClientProfile(user.id);
            console.log("¿El usuario tiene perfil?", hasProfile);
              
            if (!hasProfile) {
              navigate("/client-register");
            } else {
              navigate("/client-portal");
            }
          }
        } catch (authError: any) {
          console.error("Login error:", authError);
          toast.error(`Error al iniciar sesión: ${authError.message || "Inténtalo de nuevo"}`);
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

      try {
        const { user, session } = await signUpWithPassword(registerEmail, registerPassword);

        console.log("Usuario registrado:", { user, session });

        if (user) {
          localStorage.setItem('clientEmail', registerEmail);
          localStorage.setItem('clientLoggedIn', 'true');
          localStorage.setItem('clientUserId', user.id);
          
          console.log("Información de usuario guardada en localStorage:", {
            email: registerEmail,
            id: user.id
          });
          
          if (session) {
            toast.success("Cuenta creada correctamente. Ahora completa tu perfil.");
            setRegisterDialogOpen(false);
            navigate("/client-register");
          } else {
            toast.success("Cuenta creada. Verifica tu email para confirmar tu cuenta (si es necesario).");
            setRegisterDialogOpen(false);
            navigate("/client-register");
          }
        }
      } catch (authError: any) {
        console.error("Registration error:", authError);
        toast.error(`Error al registrar: ${authError.message}`);
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

      try {
        const { user, session } = await signUpWithPassword(trainerEmail, trainerPassword);

        if (user) {
          try {
            await saveTrainerProfile({
              name: trainerName,
              email: trainerEmail
            }, user.id);

            toast.success("Cuenta de entrenador creada correctamente");
            setTrainerRegisterDialogOpen(false);
            
            localStorage.setItem('trainerLoggedIn', 'true');
            localStorage.setItem('trainerEmail', trainerEmail);
            localStorage.setItem('trainerName', trainerName);
            navigate("/dashboard");
          } catch (profileError: any) {
            toast.error(`Error guardando datos de entrenador: ${profileError.message}`);
            setIsLoading(false);
            return;
          }
        }
      } catch (authError: any) {
        toast.error(`Error al registrar: ${authError.message}`);
        setIsLoading(false);
        return;
      }
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
          
          {/* Botón para limpiar datos locales */}
          <div className="px-4 pb-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-red-500 border-red-200 hover:bg-red-50"
              onClick={clearAllLocalData}
            >
              Limpiar datos de sesión almacenados
            </Button>
            <p className="text-xs text-center mt-2 text-gray-500">
              Usa esta opción si tienes problemas para iniciar sesión o registrarte
            </p>
          </div>
        </Card>
      </div>

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
