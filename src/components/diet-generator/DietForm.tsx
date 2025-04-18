
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DietFormData, WebhookResponse } from "@/types/diet";
import { ClientSelector } from "./ClientSelector";
import { PhysicalInfoInputs } from "./PhysicalInfoInputs";
import { DietaryPreferences } from "./DietaryPreferences";
import { AllergySelector } from "./AllergySelector";
import { SubmitButton } from "./SubmitButton";
import { foodOptions } from "./dietConstants";
import { supabase } from "@/integrations/supabase/client";

interface DietFormProps {
  onDietGenerated: (response: WebhookResponse, formData: DietFormData) => void;
}

export const DietForm = ({ onDietGenerated }: DietFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState<DietFormData>({
    clientId: "",
    clientName: "",
    dietName: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    meals: "3",
    activityLevel: "",
    allergies: [] as string[],
    goal: "",
    dietType: "",
  });

  // Fetch clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Fallback to local storage
        const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
        setClients(storedClients);
      }
    };
    
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "clientId" && value !== "nuevo") {
      // Find client in Supabase clients
      const selectedClient = clients.find(client => client.id === value);
      
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientId: value,
          clientName: selectedClient.name,
          age: selectedClient.age?.toString() || "",
          weight: selectedClient.weight || "",
          height: selectedClient.height || "",
          sex: selectedClient.sex || "",
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => {
      const newAllergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies: newAllergies };
    });
  };

  const handleGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.age || !formData.weight || !formData.height || !formData.sex || !formData.activityLevel || !formData.goal || !formData.dietType || !formData.dietName) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    // Additional validation for client name when creating a new client
    if (formData.clientId === "nuevo" && !formData.clientName) {
      toast.error("Por favor ingresa el nombre del cliente");
      return;
    }

    setIsGenerating(true);

    try {
      // Send data to webhook
      const response = await fetch("https://primary-production-d78e.up.railway.app/webhook-test/23e2526a-6cb2-439e-a5ae-cd9e3db98365", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get webhook response data
      const webhookResponse = await response.json();
      
      // Pass the response and form data to the parent component
      onDietGenerated(webhookResponse, formData);
      toast.success("Plan dietético generado correctamente");
    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast.error("Error al generar el plan dietético");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros del Plan Dietético</CardTitle>
        <CardDescription>
          Completa la siguiente información para generar un plan dietético personalizado. Los campos marcados con * son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateDiet} className="space-y-6">
          <ClientSelector 
            clientId={formData.clientId} 
            clientName={formData.clientName}
            dietName={formData.dietName}
            onClientChange={(value) => handleSelectChange("clientId", value)}
            onClientNameChange={handleChange}
            onDietNameChange={handleChange}
            clients={clients}
          />
          
          <PhysicalInfoInputs 
            age={formData.age}
            weight={formData.weight}
            height={formData.height}
            sex={formData.sex}
            onInputChange={handleChange}
            onSelectChange={handleSelectChange}
          />
          
          <DietaryPreferences 
            meals={formData.meals}
            activityLevel={formData.activityLevel}
            goal={formData.goal}
            dietType={formData.dietType}
            onSelectChange={handleSelectChange}
          />
          
          <AllergySelector 
            allergies={formData.allergies}
            foodOptions={foodOptions}
            onToggleAllergy={toggleAllergy}
          />
          
          <SubmitButton isGenerating={isGenerating} />
        </form>
      </CardContent>
    </Card>
  );
};
