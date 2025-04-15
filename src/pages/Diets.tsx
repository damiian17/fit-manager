
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Salad, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getDiets, getClientById } from "@/utils/clientStorage";
import { toast } from "sonner";
import { Diet } from "@/services/supabaseService";
import { DietDetailView } from "@/components/client-portal/DietDetailView";
import { supabase } from "@/integrations/supabase/client";

// Empty state for when there are no diet plans yet
const EmptyState = () => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="rounded-full bg-fitBlue-100 p-3">
        <Salad className="h-8 w-8 text-fitBlue-600" />
      </div>
      <h3 className="text-lg font-medium">No hay planes dietéticos</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Aún no se han creado planes dietéticos. Crea un nuevo plan para asignarlo a tus clientes.
      </p>
      <Link 
        to="/diets/new" 
        className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nuevo Plan Dietético
      </Link>
    </div>
  </Card>
);

interface GroupedDiets {
  id: number | string;
  name: string;
  diets: Diet[];
}

const Diets = () => {
  const [clientDiets, setClientDiets] = useState<GroupedDiets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);

  useEffect(() => {
    // Load diets from Supabase
    const loadDiets = async () => {
      try {
        setIsLoading(true);
        
        // Get all diets
        const diets = await getDiets();
        
        // Group diets by client
        const groupedDiets: { [key: string]: GroupedDiets } = {};
        
        // Process each diet
        for (const diet of diets) {
          // Changed client_id to clientId to match the correct property name
          const clientId = diet.clientId.toString();
          
          if (!groupedDiets[clientId]) {
            // Fetch client information
            const client = await getClientById(clientId);
            
            groupedDiets[clientId] = {
              id: clientId,
              name: client ? client.name : `Cliente ${clientId}`,
              diets: []
            };
          }
          
          // Fetch the actual diet data from Supabase to ensure we have the complete data
          const { data: dietData } = await supabase
            .from('diets')
            .select('*')
            .eq('id', diet.id)
            .single();
          
          if (dietData) {
            // Convert the Diet type from clientStorage to the Diet type from supabaseService
            const convertedDiet: Diet = {
              id: diet.id,
              name: diet.name,
              client_id: diet.clientId,
              client_name: diet.clientName,
              created_at: diet.createdAt,
              diet_data: dietData.diet_data || [],
              form_data: dietData.form_data || {}
            };
            
            groupedDiets[clientId].diets.push(convertedDiet);
          } else {
            console.error(`Could not fetch complete diet data for diet ID: ${diet.id}`);
          }
        }
        
        // Convert grouped diets object to array
        setClientDiets(Object.values(groupedDiets));
      } catch (error) {
        console.error("Error loading diets:", error);
        toast.error("Error al cargar los planes dietéticos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDiets();
  }, []);

  const handleViewDietDetails = async (diet: Diet) => {
    try {
      // Get the complete diet data from Supabase
      const { data: dietData, error } = await supabase
        .from('diets')
        .select('*')
        .eq('id', diet.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (dietData) {
        // Create a complete diet object with all the necessary data
        const completeDiet: Diet = {
          id: diet.id,
          name: diet.name,
          client_id: diet.client_id,
          client_name: diet.client_name,
          created_at: diet.created_at,
          diet_data: dietData.diet_data || [],
          form_data: dietData.form_data || {}
        };
        
        setSelectedDiet(completeDiet);
      } else {
        toast.error("No se pudieron cargar los datos de la dieta");
      }
    } catch (error) {
      console.error("Error loading diet details:", error);
      toast.error("Error al cargar los detalles de la dieta");
    }
  };

  const handleBackFromDetails = () => {
    setSelectedDiet(null);
  };

  // Si hay una dieta seleccionada, mostrar la vista detallada
  if (selectedDiet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DietDetailView diet={selectedDiet} onBack={handleBackFromDetails} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Planes Dietéticos</h1>
          <Link 
            to="/diets/new" 
            className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Salad className="mr-2 h-4 w-4" />
            Nuevo Plan Dietético
          </Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Gestiona todos los planes alimenticios asignados a tus clientes
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Cargando planes dietéticos...</p>
          </div>
        ) : clientDiets.length > 0 ? (
          <div className="space-y-6">
            {clientDiets.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="bg-fitBlue-50 dark:bg-fitBlue-900/30 px-6 py-4">
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription>
                    {client.diets.length} {client.diets.length === 1 ? 'plan dietético' : 'planes dietéticos'} asignados
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {client.diets.map((diet) => (
                      <div 
                        key={diet.id} 
                        className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleViewDietDetails(diet)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{diet.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Desde: {new Date(diet.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="secondary">
                            Ver detalles
                          </Badge>
                          <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default Diets;
