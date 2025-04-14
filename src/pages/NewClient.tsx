
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
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
import { ChevronLeft, Save, User, Upload } from "lucide-react";
import { toast } from "sonner";
import { saveClient } from "@/utils/clientStorage";

const NewClient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

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
      // Validate form
      if (!formData.name || !formData.email) {
        toast.error("Por favor completa los campos obligatorios");
        return;
      }

      // Generate a unique ID
      const newClient = {
        ...formData,
        id: Date.now(),
        status: "active",
        age: formData.birthdate ? calculateAge(formData.birthdate) : 0,
        diets: [],
        workouts: []
      };

      // Save client
      saveClient(newClient);

      // On success
      toast.success("Cliente añadido correctamente");
      navigate("/clients");
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Error al añadir cliente");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/clients")} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Añadir Nuevo Cliente</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Ingresa la información básica del cliente. Los campos marcados con * son obligatorios.
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
                        required
                      />
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
                        <SelectValue placeholder="Selecciona un nivel" />
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
                      placeholder="Describe los objetivos de fitness del cliente (pérdida de peso, ganancia muscular, etc.)..." 
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
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                  <CardDescription>
                    Añade una foto de perfil del cliente (opcional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <User className="h-20 w-20 text-gray-300" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Imagen
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full bg-fitBlue-600 hover:bg-fitBlue-700" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Guardando..." : "Guardar Cliente"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/clients")}
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewClient;
