import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getActiveSession, getCurrentUser } from "@/utils/authUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ClientRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    height: "",
    weight: "",
    fitnessLevel: "",
    goals: "",
    medicalHistory: "",
    sex: "",
  });

  // Obtener el email del cliente y verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      console.log("Verificando sesión de usuario...");
      // Obtener sesión actual
      const session = await getActiveSession();
      
      if (!session) {
        console.log("No hay sesión activa, verificando localStorage...");
        // Si no hay sesión, intentar usar el email del localStorage
        const storedEmail = localStorage.getItem('clientEmail');
        const clientLoggedIn = localStorage.getItem('clientLoggedIn');
        
        if (!storedEmail || !clientLoggedIn) {
          console.log("No hay datos en localStorage, redirigiendo a login...");
          toast.error("Por favor inicia sesión o regístrate primero");
          navigate("/login");
          return;
        }
        
        setClientEmail(storedEmail);
        setFormData(prev => ({...prev, email: storedEmail}));
        console.log("Usando email del localStorage:", storedEmail);
      } else {
        // Si hay sesión, usar los datos del usuario autenticado
        const userEmail = session.user.email;
        const userId = session.user.id;
        console.log("Sesión activa encontrada:", { userEmail, userId });
        
        if (!userId) {
          setSessionError("No se pudo obtener el ID de usuario. Por favor, inicia sesión nuevamente.");
          return;
        }
        
        setUserId(userId);
        
        // Obtener datos del usuario, incluidos posibles datos de redes sociales
        const user = await getCurrentUser();
        
        let userName = "";
        
        // Si se ha registrado con OAuth, intentar obtener el nombre
        if (user?.app_metadata?.provider === 'google') {
          userName = user.user_metadata?.full_name || "";
        }
        
        if (userEmail) {
          setClientEmail(userEmail);
          setFormData(prev => ({
            ...prev, 
            email: userEmail,
            name: userName || prev.name
          }));
          localStorage.setItem('clientEmail', userEmail);
          localStorage.setItem('clientLoggedIn', 'true');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar formulario
      if (!formData.name || !formData.email) {
        toast.error("Por favor completa los campos obligatorios");
        setIsSubmitting(false);
        return;
      }

      // Si hay un userId en el estado, usarlo. De lo contrario, obtener la sesión actual
      let userIdToUse = userId;
      
      if (!userIdToUse) {
        // Intentar obtener sesión
        const session = await getActiveSession();
        
        if (session && session.user) {
          userIdToUse = session.user.id;
        } else {
          // Intentar obtener el ID a partir del email
          const currentUser = await getCurrentUser();
          if (currentUser) {
            userIdToUse = currentUser.id;
          } else {
            console.error("No se pudo determinar el ID de usuario");
            toast.error("Error de autenticación. Por favor, inicia sesión e inténtalo de nuevo.");
            setTimeout(() => navigate("/login"), 2000);
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (!userIdToUse) {
        console.error("No se pudo determinar el ID de usuario después de varios intentos");
        toast.error("Error de autenticación. Vuelve a iniciar sesión y completa el formulario de nuevo.");
        setTimeout(() => navigate("/login"), 2000);
        setIsSubmitting(false);
        return;
      }

      console.log("Registrando cliente con ID:", userIdToUse);

      // Calcular edad si hay fecha de nacimiento
      const age = formData.birthdate ? calculateAge(formData.birthdate) : undefined;

      // Guardar perfil del cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert({
          id: userIdToUse,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          birthdate: formData.birthdate || null,
          height: formData.height || null,
          weight: formData.weight || null,
          fitness_level: formData.fitnessLevel || null,
          goals: formData.goals || null,
          medical_history: formData.medicalHistory || null,
          status: "active",
          age: age,
          sex: formData.sex || null
        })
        .select();

      if (clientError) {
        console.error("Error al guardar perfil:", clientError);
        toast.error(`Error al guardar perfil: ${clientError.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log("Perfil de cliente guardado:", clientData);

      // Marcar al cliente como conectado
      localStorage.setItem('clientLoggedIn', 'true');

      // Éxito
      toast.success("¡Registro completado con éxito! Tu entrenador podrá ver tu perfil y asignarte rutinas y dietas.");
      navigate("/client-portal");
    } catch (error: any) {
      console.error("Error registering client:", error);
      toast.error(`Error al registrar: ${error.message || "Inténtalo de nuevo"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <main className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Completa tu Perfil</CardTitle>
            <CardDescription>
              Proporciónanos tu información para que tu entrenador pueda crear planes personalizados para ti
            </CardDescription>
          </CardHeader>
        </Card>
        
        {sessionError ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {sessionError}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleReturnToLogin} 
                className="w-full"
              >
                Volver a iniciar sesión
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Ingresa tu información personal. Los campos marcados con * son obligatorios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Ej. Ana García Pérez" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Ej. cliente@ejemplo.com" 
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      required
                    />
                    <p className="text-sm text-gray-500">Email de registro (no se puede cambiar)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="Ej. +34 612 345 678" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                    <Input 
                      id="birthdate" 
                      name="birthdate" 
                      type="date" 
                      value={formData.birthdate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input 
                      id="height" 
                      name="height" 
                      type="number" 
                      placeholder="Ej. 170" 
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input 
                      id="weight" 
                      name="weight" 
                      type="number" 
                      placeholder="Ej. 65" 
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fitnessLevel">Nivel de fitness</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
                    value={formData.fitnessLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("sex", value)}
                    value={formData.sex}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goals">Objetivos de fitness</Label>
                  <Textarea 
                    id="goals" 
                    name="goals" 
                    placeholder="Describe tus objetivos de fitness (pérdida de peso, ganancia muscular, etc.)..." 
                    className="min-h-[100px]"
                    value={formData.goals}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Historial médico relevante (opcional)</Label>
                  <Textarea 
                    id="medicalHistory" 
                    name="medicalHistory" 
                    placeholder="Indica cualquier información médica relevante (lesiones, condiciones, alergias, etc.)..." 
                    className="min-h-[100px]"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button type="submit" className="w-full max-w-md bg-fitBlue-600 hover:bg-fitBlue-700" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Guardando..." : "Completar Registro"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </main>
    </div>
  );
};

export default ClientRegister;
