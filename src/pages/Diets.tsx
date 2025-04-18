
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Salad, ChevronRight, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Diet, getDietById } from "@/services/supabaseService";
import { DietDetailView } from "@/components/client-portal/DietDetailView";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();

  const loadDiets = async () => {
    try {
      console.log("Loading diets...");
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const trainerId = session?.user?.id;
      
      if (!trainerId) {
        console.error("No trainer ID found in session");
        toast.error("Error: No se pudo identificar al entrenador");
        setIsLoading(false);
        return;
      }
      
      const { data: supabaseDiets, error } = await supabase
        .from('diets')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching diets from Supabase:", error);
        toast.error("Error al cargar los planes dietéticos");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetched diets from Supabase:", supabaseDiets);
      
      const groupedDiets: { [key: string]: GroupedDiets } = {};
      
      if (supabaseDiets && Array.isArray(supabaseDiets)) {
        for (const diet of supabaseDiets) {
          const clientId = diet.client_id ? diet.client_id.toString() : "unknown";
          
          if (!groupedDiets[clientId]) {
            groupedDiets[clientId] = {
              id: clientId,
              name: diet.client_name || "Cliente sin asignar",
              diets: []
            };
          }
          
          const convertedDiet: Diet = {
            id: diet.id,
            name: diet.name,
            client_id: diet.client_id || "",
            client_name: diet.client_name,
            created_at: diet.created_at || new Date().toISOString(),
            diet_data: diet.diet_data || [],
            form_data: diet.form_data || {}
          };
          
          groupedDiets[clientId].diets.push(convertedDiet);
        }
      }
      
      setClientDiets(Object.values(groupedDiets));
    } catch (error) {
      console.error("Error loading diets:", error);
      toast.error("Error al cargar los planes dietéticos");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadDiets();
  }, []);

  const handleViewDietDetails = async (diet: Diet) => {
    try {
      console.log("Viewing diet details for:", diet.id);
      const dietDetails = await getDietById(diet.id);
      
      if (dietDetails) {
        console.log("Diet details fetched successfully:", dietDetails);
        setSelectedDiet(dietDetails);
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

  const handleDeleteDiet = async () => {
    if (!selectedDiet) return;
    try {
      console.log("Deleting diet with ID:", selectedDiet.id);
      
      const { error } = await supabase
        .from('diets')
        .delete()
        .eq('id', selectedDiet.id);

      if (error) {
        console.error("Error from Supabase:", error);
        toast.error("Error al eliminar el plan dietético");
        return;
      }

      toast.success("Plan dietético eliminado correctamente");
      setSelectedDiet(null);
      loadDiets();
    } catch (error) {
      console.error("Error deleting diet:", error);
      toast.error("Error al eliminar el plan dietético");
    }
  };
  
  const handleEditMeal = (day: string, mealKey: string, meal: any) => {
    if (!selectedDiet) return;
    
    console.log("Editing meal:", { day, mealKey, meal });
    
    navigate(`/diets/edit/${selectedDiet.id}`, { 
      state: { 
        dietData: selectedDiet.diet_data,
        formData: selectedDiet.form_data,
        clientInfo: {
          id: selectedDiet.client_id,
          name: selectedDiet.client_name,
          dietName: selectedDiet.name
        },
        editingMeal: {
          day,
          mealKey,
          meal
        }
      } 
    });
  };

  if (selectedDiet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DietDetailView 
            diet={selectedDiet} 
            onBack={handleBackFromDetails}
            onDelete={handleDeleteDiet}
            onEditMeal={handleEditMeal}
          />
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
