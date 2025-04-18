
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DietForm } from "@/components/diet-generator/DietForm";
import { DietPlan } from "@/components/diet-generator/DietPlan";
import { NutritionalTips } from "@/components/diet-generator/NutritionalTips";
import { WebhookResponse, DietFormData } from "@/types/diet";
import { toast } from "sonner";
import { saveClient, getClientById } from "@/utils/clientStorage";
import { saveDiet, getDietById, updateDiet } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";

interface ClientInfo {
  id: string;
  name: string;
  dietName: string;
}

const DietGenerator = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [dietGenerated, setDietGenerated] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Lunes");
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    id: "",
    name: "",
    dietName: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDietId, setEditingDietId] = useState<string | null>(null);

  // Check if we're editing an existing diet
  useEffect(() => {
    const loadExistingDiet = async () => {
      if (id) {
        try {
          const diet = await getDietById(id);
          if (diet) {
            setIsEditing(true);
            setEditingDietId(id);
            
            // Initialize clientInfo
            setClientInfo({
              id: diet.client_id || "",
              name: diet.client_name || "",
              dietName: diet.name || ""
            });
            
            // Initialize webhookResponse
            if (diet.diet_data) {
              setWebhookResponse(Array.isArray(diet.diet_data) ? diet.diet_data : [diet.diet_data]);
              setDietGenerated(true);
            }
            
            // Set selected option
            if (diet.form_data && diet.form_data.selectedOption) {
              setSelectedOption(diet.form_data.selectedOption);
            } else if (Array.isArray(diet.diet_data) && diet.diet_data.length > 0) {
              setSelectedOption(diet.diet_data[0].dia || "Lunes");
            }
            
            // Handle editing specific meal if provided in location state
            if (location.state?.editingMeal) {
              const { day, mealKey } = location.state.editingMeal;
              if (day) {
                setSelectedOption(day);
              }
            }
          }
        } catch (error) {
          console.error("Error loading diet for editing:", error);
          toast.error("Error al cargar la dieta para editar");
        }
      }
    };
    
    loadExistingDiet();
  }, [id, location.state]);

  const handleDietGenerated = (response: WebhookResponse, formData: DietFormData) => {
    console.log("Webhook response received:", response);
    
    // Check if response is valid
    if (!response || !Array.isArray(response) || response.length === 0) {
      toast.error("La respuesta del servidor no es válida");
      console.error("Invalid webhook response:", response);
      return;
    }
    
    // Set client information from form data
    setClientInfo({
      id: formData.clientId,
      name: formData.clientName || "",
      dietName: formData.dietName
    });
    
    // Set the webhook response in state
    setWebhookResponse(response);
    
    // Set default selected option to first day
    setSelectedOption(response[0]?.dia || "Lunes");
    
    // Set dietGenerated to true after a short delay to ensure state is updated
    setTimeout(() => {
      setDietGenerated(true);
    }, 300);
  };

  const handleResetForm = () => {
    if (isEditing) {
      // If editing, go back to diets page
      navigate("/diets");
    } else {
      // If creating new, reset form
      setDietGenerated(false);
      setWebhookResponse(null);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSaveDiet = async () => {
    if (!webhookResponse) {
      toast.error("No hay datos de dieta para guardar");
      return;
    }
    
    try {
      if (isEditing && editingDietId) {
        // Update existing diet
        const dietToUpdate = {
          id: editingDietId,
          name: clientInfo.dietName,
          diet_data: webhookResponse,
          form_data: { selectedOption }
        };
        
        const updatedDiet = await updateDiet(dietToUpdate);
        
        if (!updatedDiet) {
          toast.error("Error al actualizar la dieta en la base de datos");
          return;
        }
        
        toast.success(`Plan dietético "${clientInfo.dietName}" actualizado`);
      } else {
        // Create new diet
        let clientId: string;
        
        // Check if we need to create a new client or use an existing one
        if (clientInfo.id === "nuevo") {
          if (!clientInfo.name) {
            toast.error("Es necesario proporcionar un nombre para el nuevo cliente");
            return;
          }
          
          // Create a new client in Supabase
          try {
            const { data, error } = await supabase.from('clients').insert({
              name: clientInfo.name,
              status: 'active'
            }).select().single();
            
            if (error) throw error;
            clientId = data.id.toString();
          } catch (error) {
            console.error("Error creating client in Supabase:", error);
            toast.error("Error al crear el cliente en la base de datos");
            return;
          }
          
          toast.success(`Nuevo cliente "${clientInfo.name}" creado`);
        } else {
          // Use existing client ID
          clientId = clientInfo.id;
          
          // Verify the client exists
          const existingClient = await getClientById(clientId);
          if (!existingClient) {
            toast.error("No se encontró el cliente seleccionado");
            return;
          }
        }
        
        // Create and save diet to Supabase
        const dietToSave = {
          name: clientInfo.dietName,
          client_id: clientId,
          client_name: clientInfo.name,
          diet_data: webhookResponse,
          form_data: { selectedOption }
        };
        
        const savedDiet = await saveDiet(dietToSave);
        
        if (!savedDiet) {
          toast.error("Error al guardar la dieta en la base de datos");
          return;
        }
        
        toast.success(`Plan dietético "${clientInfo.dietName}" guardado para ${clientInfo.name}`);
      }
      
      navigate("/diets");
    } catch (error) {
      console.error("Error al guardar la dieta:", error);
      toast.error("Hubo un error al guardar el plan dietético");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {isEditing ? "Editar Plan Dietético" : "Generador de Dietas"}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!dietGenerated ? (
              <DietForm onDietGenerated={handleDietGenerated} />
            ) : webhookResponse && webhookResponse.length > 0 ? (
              <DietPlan 
                webhookResponse={webhookResponse}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
                onReset={handleResetForm}
                onSave={handleSaveDiet}
                clientInfo={clientInfo}
                dietId={editingDietId || undefined}
              />
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-medium text-gray-700">Error al cargar los datos</h3>
                <p className="mt-2 text-gray-500">No se pudo cargar la información de la dieta.</p>
                <Button 
                  variant="outline" 
                  onClick={handleResetForm}
                  className="mt-4"
                >
                  Volver al formulario
                </Button>
              </div>
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
