
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
import { 
  getActiveSession, 
  getCurrentUser, 
  saveClientProfile 
} from "@/utils/authUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoalsAndMedicalInputs from "@/components/clients/GoalsAndMedicalInputs";
import PersonalInfoInputs from "@/components/clients/PersonalInfoInputs";

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
      try {
        console.log("Verificando sesión de usuario...");
        // Obtener sesión actual
        const session = await getActiveSession();
        
        if (session && session.user) {
          // Si hay sesión, usar los datos del usuario autenticado
          console.log("Sesión activa encontrada:", session);
          
          setUserId(session.user.id);
          
          // Obtener datos del usuario, incluidos posibles datos de redes sociales
          const user = await getCurrentUser();
          console.log("Datos del usuario:", user);
          
          let userName = "";
          
          // Si se ha registrado con OAuth, intentar obtener el nombre
          if (user?.app_metadata?.provider === 'google') {
            userName = user.user_metadata?.full_name || "";
          }
          
          if (session.user.email) {
            setClientEmail(session.user.email);
            setFormData(prev => ({
              ...prev, 
              email: session.user.email || "",
              name: userName || prev.name
            }));
            localStorage.setItem('clientEmail', session.user.email);
            localStorage.setItem('clientLoggedIn', 'true');
          }
        } else {
          console.log("No hay sesión activa, verificando localStorage...");
          // Si no hay sesión, intentar usar el email del localStorage
          const storedEmail = localStorage.getItem('clientEmail');
          const clientLoggedIn = localStorage.getItem('clientLoggedIn');
          
          if (!storedEmail || !clientLoggedIn) {
            console.log("No hay datos en localStorage, redirigiendo a login...");
            setSessionError("No se ha podido encontrar una sesión activa. Por favor, inicia sesión primero.");
            return;
          }
          
          setClientEmail(storedEmail);
          setFormData(prev => ({...prev, email: storedEmail}));
          console.log("Usando email del localStorage:", storedEmail);
          
          // Intentar obtener usuario actual aunque no haya sesión detectada
          const user = await getCurrentUser();
          if (user) {
            setUserId(user.id);
            console.log("Usuario encontrado a pesar de no detectar sesión:", user);
          } else {
            console.log("No se pudo obtener el usuario actual");
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setSessionError("Error al verificar la sesión. Por favor, inicia sesión nuevamente.");
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

      // Calcular edad si hay fecha de nacimiento
      const age = formData.birthdate ? calculateAge(formData.birthdate) : undefined;

      // Preparar datos del cliente
      const clientData = {
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
      };

      // Intentar guardar el perfil del cliente
      await saveClientProfile(clientData, userId || undefined);

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
                <PersonalInfoInputs 
                  formData={formData} 
                  handleChange={handleChange} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <GoalsAndMedicalInputs 
                  formData={formData} 
                  handleChange={handleChange} 
                />
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
