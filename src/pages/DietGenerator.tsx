
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DietForm } from "@/components/diet-generator/DietForm";
import { DietPlan } from "@/components/diet-generator/DietPlan";
import { NutritionalTips } from "@/components/diet-generator/NutritionalTips";
import { WebhookResponse, DietOption } from "@/types/diet";
import { toast } from "sonner";
import { saveDiet, getClientById } from "@/utils/clientStorage";

const DietGenerator = () => {
  const navigate = useNavigate();
  const [dietGenerated, setDietGenerated] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Opcion1");
  const [clientInfo, setClientInfo] = useState({
    id: "",
    name: "",
    dietName: ""
  });

  const handleDietGenerated = (response: WebhookResponse) => {
    // Extract client information from the first item in the response
    const firstItem = response[0];
    if (firstItem && 'clientId' in firstItem && 'clientName' in firstItem && 'dietName' in firstItem) {
      setClientInfo({
        id: firstItem.clientId,
        name: firstItem.clientName,
        dietName: firstItem.dietName
      });
    }
    
    setWebhookResponse(response);
    setDietGenerated(true);
  };

  const handleResetForm = () => {
    setDietGenerated(false);
    setWebhookResponse(null);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSaveDiet = () => {
    if (!webhookResponse) return;
    
    // Get the selected diet option
    const selectedDietOption = webhookResponse.find(
      (item) => 'opcion' in item && item.opcion === selectedOption
    ) as DietOption | undefined;
    
    if (!selectedDietOption) {
      toast.error("No se pudo encontrar la opción de dieta seleccionada");
      return;
    }
    
    try {
      // Create a diet object
      const clientId = clientInfo.id !== "nuevo" ? parseInt(clientInfo.id) : null;
      
      // If no valid client ID, show an error
      if (!clientId) {
        toast.error("Es necesario seleccionar un cliente existente para guardar la dieta");
        return;
      }
      
      // Check if client exists
      const client = getClientById(clientId);
      if (!client) {
        toast.error("No se encontró el cliente seleccionado");
        return;
      }
      
      // Create and save diet
      const newDiet = {
        id: Date.now(),
        name: clientInfo.dietName,
        clientId: clientId,
        clientName: client.name,
        createdAt: new Date().toISOString(),
        content: selectedDietOption,
        status: "Activa"
      };
      
      saveDiet(newDiet);
      toast.success(`Plan dietético "${clientInfo.dietName}" guardado para ${client.name}`);
      navigate("/diets");
    } catch (error) {
      console.error("Error al guardar la dieta:", error);
      toast.error("Hubo un error al guardar el plan dietético");
    }
  };

  // Get the selected diet option
  const selectedDietOption = webhookResponse?.find(
    (item) => 'opcion' in item && item.opcion === selectedOption
  ) as DietOption | undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/diets")} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Generador de Dietas</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!dietGenerated ? (
              <DietForm onDietGenerated={handleDietGenerated} />
            ) : (
              <DietPlan 
                webhookResponse={webhookResponse}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
                onReset={handleResetForm}
                onSave={handleSaveDiet}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <NutritionalTips />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DietGenerator;
