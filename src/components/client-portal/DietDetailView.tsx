import { useState, useEffect } from 'react';
import { Diet } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Pencil, MessageSquare, Edit } from "lucide-react";
import { DailyMeal } from "@/types/diet";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface DietDetailViewProps {
  diet: Diet;
  onBack: () => void;
  onDelete?: () => void;
  isClientView?: boolean;
  onRequestChange?: (message: string) => void;
  onEditMeal?: (day: string, mealKey: string, meal: any) => void;
}

export const DietDetailView = ({ 
  diet, 
  onBack, 
  onDelete, 
  isClientView = false,
  onRequestChange,
  onEditMeal
}: DietDetailViewProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dietData, setDietData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [isRequestChangeDialogOpen, setIsRequestChangeDialogOpen] = useState(false);
  const [changeRequestMessage, setChangeRequestMessage] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const handleEditDiet = () => {
    navigate(`/diets/edit/${diet.id}`, { 
      state: { 
        dietData: diet.diet_data,
        formData: diet.form_data,
        clientInfo: {
          id: diet.client_id,
          name: diet.client_name,
          dietName: diet.name
        }
      } 
    });
  };
  
  const handleEditMeal = (day: string, mealKey: string, meal: any) => {
    if (onEditMeal) {
      onEditMeal(day, mealKey, meal);
    } else {
      navigate(`/diets/edit/${diet.id}`, { 
        state: { 
          dietData: diet.diet_data,
          formData: diet.form_data,
          clientInfo: {
            id: diet.client_id,
            name: diet.client_name,
            dietName: diet.name
          },
          editingMeal: {
            day,
            mealKey,
            meal
          }
        } 
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>Cargando datos de la dieta...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (!dietData || dietData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>No hay datos disponibles para esta dieta</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isNewFormat = dietData.length > 0 && dietData[0] && 'dia' in dietData[0];
  
  if (isNewFormat) {
    const dailyMeals = dietData as DailyMeal[];
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="w-full">
              <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle>{diet.name}</CardTitle>
                  <CardDescription>
                    Plan dietético personalizado de {dailyMeals.length} días
                  </CardDescription>
                </div>
                {!isClientView ? (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      onClick={handleEditDiet}
                      size="sm"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                ) : (
                  onRequestChange && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRequestChangeDialogOpen(true)}
                      size="sm"
                      className="mt-2 sm:mt-0"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Solicitar cambio
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full flex flex-nowrap">
                {dailyMeals.map((day) => (
                  <TabsTrigger 
                    key={day.dia} 
                    value={day.dia}
                    className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-1.5"
                  >
                    {day.dia}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {dailyMeals.map((day) => (
              <TabsContent key={day.dia} value={day.dia} className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calorías totales:</span> {day.kcalTotales} kcal
                    </div>
                    <div>
                      <span className="font-medium">Objetivo diario:</span> {day.kcalObjetivo} kcal
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="font-medium">Variación calórica:</span> {day.variacion}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(day)
                    .filter(([key]) => key.startsWith('comida') && day[key as keyof DailyMeal])
                    .map(([mealKey, meal]) => {
                      if (!meal) return null;
                      
                      return (
                        <Card key={mealKey}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base sm:text-lg">{meal.nombre}</CardTitle>
                                <CardDescription>Comida {mealKey.replace('comida', '')}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
                                  {meal.kcals} kcal
                                </span>
                                {!isClientView && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEditMeal(day.dia, mealKey, meal)}
                                    className="text-fitBlue-600"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Ingredientes:</h4>
                                <div className="text-sm whitespace-pre-line">
                                  {meal.ingredientes}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm mb-1">Grupos de alimentos:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {meal.grupos.split(', ').map((grupo, index) => (
                                    <span 
                                      key={index}
                                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded dark:bg-gray-800 dark:text-gray-200"
                                    >
                                      {grupo}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el plan dietético. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDiet}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isRequestChangeDialogOpen} onOpenChange={setIsRequestChangeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Solicitar cambio en la dieta</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="changeMessage">Describe los cambios que necesitas</Label>
                <Textarea 
                  id="changeMessage" 
                  value={changeRequestMessage} 
                  onChange={(e) => setChangeRequestMessage(e.target.value)}
                  rows={4}
                  placeholder="Por favor, explica qué cambios necesitas en esta dieta..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRequestChangeDialogOpen(false)}>Cancelar</Button>
              <Button type="button" onClick={handleRequestChange} className="bg-fitBlue-600 hover:bg-fitBlue-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  } else {
    const dietOptions = dietData.filter(item => 'opcion' in item);
    const summaryItem = dietData.find(item => 'tipo' in item && item.tipo === 'Resumen');
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="w-full">
              <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle>{diet.name}</CardTitle>
                  <CardDescription>
                    {summaryItem ? `Calorías objetivo: ${summaryItem.caloriasTotalesDiariasObjetivo} kcal` : 'Plan dietético personalizado'}
                  </CardDescription>
                </div>
                {!isClientView ? (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      onClick={handleEditDiet}
                      size="sm"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                ) : (
                  onRequestChange && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRequestChangeDialogOpen(true)}
                      size="sm"
                      className="mt-2 sm:mt-0"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Solicitar cambio
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full flex flex-nowrap">
                {dietOptions.map((option: any) => (
                  <TabsTrigger 
                    key={option.opcion} 
                    value={option.opcion}
                    className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-1.5"
                  >
                    {option.opcion}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {dietOptions.map((option: any) => (
              <TabsContent key={option.opcion} value={option.opcion} className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calorías totales:</span> {option.caloriasTotalesDia} kcal
                    </div>
                    <div>
                      <span className="font-medium">Objetivo diario:</span> {option.caloriasDiariasObjetivo} kcal
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="font-medium">Variación calórica:</span> {option.variacionCalorica}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.keys(option.recetasSeleccionadas || {}).map((mealKey) => {
                    const meal = option.recetasSeleccionadas[mealKey];
                    if (!meal) return null;
                    
                    return (
                      <Card key={mealKey}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-base sm:text-lg">{meal.nombre}</CardTitle>
                              <CardDescription>{meal.tipo}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
                                {meal.kcals} kcal
                              </span>
                              {!isClientView && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={handleEditDiet}
                                  className="text-fitBlue-600"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Ingredientes:</h4>
                              <div className="text-sm whitespace-pre-line">
                                {meal.ingredientes}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-1">Grupos de alimentos:</h4>
                              <div className="flex flex-wrap gap-1">
                                {(meal.gruposAlimentos || "").split(', ').map((grupo: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded dark:bg-gray-800 dark:text-gray-200"
                                  >
                                    {grupo}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el plan dietético. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDiet}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isRequestChangeDialogOpen} onOpenChange={setIsRequestChangeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Solicitar cambio en la dieta</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="changeMessage">Describe los cambios que necesitas</Label>
                <Textarea 
                  id="changeMessage" 
                  value={changeRequestMessage} 
                  onChange={(e) => setChangeRequestMessage(e.target.value)}
                  rows={4}
                  placeholder="Por favor, explica qué cambios necesitas en esta dieta..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRequestChangeDialogOpen(false)}>Cancelar</Button>
              <Button type="button" onClick={handleRequestChange} className="bg-fitBlue-600 hover:bg-fitBlue-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }
};
