import { useState, useEffect } from 'react';
import { Diet } from "@/services/supabaseService";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMeal } from "@/types/diet";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DietHeader } from './diet-detail/DietHeader';
import { DietMetrics } from './diet-detail/DietMetrics';
import { MealCard } from './diet-detail/MealCard';
import { DeleteDietDialog } from './diet-detail/DeleteDietDialog';
import { ChangeRequestDialog } from './diet-detail/ChangeRequestDialog';

interface DietDetailViewProps {
  diet: Diet;
  onBack: () => void;
  onDelete?: () => void;
  isClientView?: boolean;
  onRequestChange?: (message: string) => void;
}

export const DietDetailView = ({ 
  diet, 
  onBack, 
  onDelete, 
  isClientView = false,
  onRequestChange 
}: DietDetailViewProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dietData, setDietData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [isRequestChangeDialogOpen, setIsRequestChangeDialogOpen] = useState(false);
  const [changeRequestMessage, setChangeRequestMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    
    try {
      if (diet && diet.diet_data) {
        console.log("Processing diet data:", diet.diet_data);
        
        if (typeof diet.diet_data === 'string') {
          try {
            const parsedData = JSON.parse(diet.diet_data);
            const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
            setDietData(dataArray);
          } catch (parseError) {
            console.error("Error parsing diet_data string:", parseError);
            setDietData([]);
          }
        } else if (Array.isArray(diet.diet_data)) {
          setDietData(diet.diet_data);
        } else if (typeof diet.diet_data === 'object' && diet.diet_data !== null) {
          setDietData([diet.diet_data]);
        } else {
          console.error("Unsupported diet_data format:", diet.diet_data);
          setDietData([]);
        }
      } else {
        console.error("No diet data available:", diet);
        setDietData([]);
      }
    } catch (error) {
      console.error("Error processing diet data:", error);
      toast.error("Error al procesar los datos de la dieta");
      setDietData([]);
    } finally {
      setIsLoading(false);
    }
  }, [diet]);
  
  useEffect(() => {
    if (dietData.length > 0) {
      const isNewFormat = dietData.length > 0 && dietData[0] && 'dia' in dietData[0];
      
      if (isNewFormat) {
        const dailyMeals = dietData as DailyMeal[];
        if (dailyMeals.length > 0) {
          setActiveTab(dailyMeals[0].dia);
        }
      } else {
        const dietOptions = dietData.filter(item => 'opcion' in item);
        if (dietOptions.length > 0 && dietOptions[0]?.opcion) {
          setActiveTab(dietOptions[0].opcion);
        }
      }
    }
  }, [dietData]);

  const handleDeleteDiet = async () => {
    try {
      console.log("Deleting diet with ID:", diet.id);
      
      const { error } = await supabase
        .from('diets')
        .delete()
        .eq('id', diet.id);

      if (error) {
        console.error("Error from Supabase:", error);
        toast.error("Error al eliminar el plan dietético");
        return;
      }

      toast.success("Plan dietético eliminado correctamente");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting diet:", error);
      toast.error("Error al eliminar el plan dietético");
    }
  };

  const handleRequestChange = () => {
    if (changeRequestMessage.trim() === "") {
      toast.error("Por favor indica qué cambios necesitas");
      return;
    }

    if (onRequestChange) {
      onRequestChange(changeRequestMessage);
      setIsRequestChangeDialogOpen(false);
      setChangeRequestMessage("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <DietHeader 
            onBack={onBack}
            name={diet.name}
            description="Cargando datos de la dieta..."
          />
        </CardContent>
      </Card>
    );
  }
  
  if (!dietData || dietData.length === 0) {
    return (
      <Card>
        <CardContent>
          <DietHeader 
            onBack={onBack}
            name={diet.name}
            description="No hay datos disponibles para esta dieta"
          />
        </CardContent>
      </Card>
    );
  }

  const isNewFormat = dietData.length > 0 && dietData[0] && 'dia' in dietData[0];
  
  if (isNewFormat) {
    const dailyMeals = dietData as DailyMeal[];
    
    return (
      <Card>
        <CardContent>
          <DietHeader 
            onBack={onBack}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isClientView={isClientView}
            onRequestChange={() => setIsRequestChangeDialogOpen(true)}
            name={diet.name}
            description={`Plan dietético personalizado de ${dailyMeals.length} días`}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {dailyMeals.map((day) => (
                <TabsTrigger key={day.dia} value={day.dia}>
                  {day.dia}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dailyMeals.map((day) => (
              <TabsContent key={day.dia} value={day.dia} className="space-y-6">
                <DietMetrics day={day} />
                
                <div className="space-y-6">
                  {Object.entries(day)
                    .filter(([key]) => key.startsWith('comida') && day[key as keyof DailyMeal])
                    .map(([mealKey, meal]) => {
                      if (!meal) return null;
                      return <MealCard key={mealKey} meal={meal} mealKey={mealKey} />;
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <DeleteDietDialog 
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteDiet}
          />

          <ChangeRequestDialog 
            isOpen={isRequestChangeDialogOpen}
            onOpenChange={setIsRequestChangeDialogOpen}
            message={changeRequestMessage}
            onMessageChange={setChangeRequestMessage}
            onSubmit={handleRequestChange}
          />
        </CardContent>
      </Card>
    );
  } else {
    const dietOptions = dietData.filter(item => 'opcion' in item);
    const summaryItem = dietData.find(item => 'tipo' in item && item.tipo === 'Resumen');
    
    return (
      <Card>
        <CardContent>
          <DietHeader 
            onBack={onBack}
            name={diet.name}
            description={summaryItem ? `Calorías objetivo: ${summaryItem.caloriasTotalesDiariasObjetivo} kcal` : 'Plan dietético personalizado'}
          />
        </CardContent>
      </Card>
    );
  }
};
