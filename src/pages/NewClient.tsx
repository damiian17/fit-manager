import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { saveClient } from "@/utils/clientStorage";

// Import the components
import PersonalInfoInputs from "@/components/clients/PersonalInfoInputs";
import PhysicalAttributesInputs from "@/components/clients/PhysicalAttributesInputs";
import GoalsAndMedicalInputs from "@/components/clients/GoalsAndMedicalInputs";
import ProfilePhotoCard from "@/components/clients/ProfilePhotoCard";
import ActionsCard from "@/components/clients/ActionsCard";

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

      // Create new client object
      const newClient = {
        ...formData,
        status: "active",
        age: formData.birthdate ? calculateAge(formData.birthdate) : undefined,
      };

      // Save client to Supabase
      await saveClient(newClient);

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
                  <PersonalInfoInputs 
                    formData={formData} 
                    handleChange={handleChange} 
                  />
                  
                  <PhysicalAttributesInputs 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSelectChange={handleSelectChange} 
                  />
                  
                  <GoalsAndMedicalInputs 
                    formData={formData} 
                    handleChange={handleChange} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ProfilePhotoCard />
              <ActionsCard isSubmitting={isSubmitting} />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewClient;
