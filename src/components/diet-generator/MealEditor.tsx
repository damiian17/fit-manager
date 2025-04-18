
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MealEditorProps {
  open: boolean;
  onClose: () => void;
  meal: any;
  mealKey: string;
  day: string;
  dietId: string;
  dietData: any[];
  onMealUpdated: () => void;
}

export const MealEditor = ({
  open,
  onClose,
  meal,
  mealKey,
  day,
  dietId,
  dietData,
  onMealUpdated
}: MealEditorProps) => {
  const [name, setName] = useState(meal?.nombre || "");
  const [ingredients, setIngredients] = useState(meal?.ingredientes || "");
  const [calories, setCalories] = useState(meal?.kcals?.toString() || "0");
  const [foodGroups, setFoodGroups] = useState(meal?.grupos || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Find the day in the diet data
      const updatedDietData = [...dietData];
      const dayIndex = updatedDietData.findIndex((d) => d.dia === day);
      
      if (dayIndex === -1) {
        toast.error("No se encontró el día en los datos de la dieta");
        return;
      }
      
      // Create updated meal object
      const updatedMeal = {
        ...meal,
        nombre: name,
        ingredientes: ingredients,
        kcals: parseInt(calories, 10) || 0,
        grupos: foodGroups
      };
      
      // Update the meal in the day
      updatedDietData[dayIndex] = {
        ...updatedDietData[dayIndex],
        [mealKey]: updatedMeal
      };
      
      // Calculate the new total calories for the day
      const dayData = updatedDietData[dayIndex];
      let totalCalories = 0;
      
      Object.entries(dayData).forEach(([key, value]) => {
        if (key.startsWith('comida') && value && typeof value === 'object' && 'kcals' in value) {
          totalCalories += (value as any).kcals;
        }
      });
      
      // Update total calories for the day
      updatedDietData[dayIndex].kcalTotales = totalCalories;
      
      // Calculate variation from target
      const targetCalories = dayData.kcalObjetivo || 0;
      const variation = totalCalories > 0 && targetCalories > 0
        ? `${((totalCalories - targetCalories) / targetCalories * 100).toFixed(1)}% (${totalCalories - targetCalories} kcal)`
        : "No calculado";
      
      updatedDietData[dayIndex].variacion = variation;
      
      // Save to database
      const { error } = await supabase
        .from('diets')
        .update({ diet_data: updatedDietData })
        .eq('id', dietId);
      
      if (error) {
        console.error("Error updating diet:", error);
        toast.error("Error al guardar los cambios");
        return;
      }
      
      toast.success("Comida actualizada correctamente");
      onMealUpdated();
      onClose();
    } catch (error) {
      console.error("Error saving meal:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar comida</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calories" className="text-right">
              Calorías
            </Label>
            <Input
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              type="number"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="foodGroups" className="text-right">
              Grupos
            </Label>
            <Input
              id="foodGroups"
              value={foodGroups}
              onChange={(e) => setFoodGroups(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredients" className="text-right">
              Ingredientes
            </Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="col-span-3"
              rows={6}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading} className="bg-fitBlue-600 hover:bg-fitBlue-700">
            {isLoading ? "Guardando..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
