
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

const ClientRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
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

  // Obtener el email del cliente del localStorage y verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        toast.error("Por favor inicia sesión primero");
        return;
      }
      
      // Establecer el email del usuario autenticado
      const userEmail = session.user.email;
      if (userEmail) {
        setClientEmail(userEmail);
        setFormData(prev => ({...prev, email: userEmail}));
        localStorage.setItem('clientEmail', userEmail);
      } else {
        // Si no hay email en la sesión, usar el del localStorage como fallback
        const storedEmail = localStorage.getItem('clientEmail');
        if (storedEmail) {
          setClientEmail(storedEmail);
          setFormData(prev => ({...prev, email: storedEmail}));
        } else {
          // Si no hay email en ninguna parte, redirigir al login
          navigate("/login");
          toast.error("Por favor registra una cuenta primero");
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

      // Obtener el usuario autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        toast.error("No hay sesión activa");
        navigate("/login");
        return;
      }

      const userId = session.user.id;
      console.log("Registrando cliente con ID:", userId);

      // Calcular edad si hay fecha de nacimiento
      const age = formData.birthdate ? calculateAge(formData.birthdate) : undefined;

      // Verificar si ya existe un perfil para este usuario
      const { data: existingProfile } = await supabase
        .from('clients')
        .select('id')
        .eq('id', userId)
        .single();

      let clientData;
      
      if (existingProfile) {
        // Actualizar el perfil existente
        const { data, error } = await supabase
          .from('clients')
          .update({
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
          .eq('id', userId)
          .select();
          
        if (error) throw error;
        clientData = data;
      } else {
        // Crear un nuevo perfil de cliente
        const { data, error } = await supabase
          .from('clients')
          .insert({
            id: userId, // Usar el ID de autenticación como ID de cliente
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

        if (error) throw error;
        clientData = data;
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
      </main>
    </div>
  );
};

export default ClientRegister;
