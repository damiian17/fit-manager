
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileDown, Mail, Salad } from "lucide-react";
import { GeneratedDiet } from "@/types/diet";

interface DietPlanProps {
  generatedDiet: GeneratedDiet;
  onReset: () => void;
}

export const DietPlan = ({ generatedDiet, onReset }: DietPlanProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plan Dietético Personalizado</CardTitle>
            <CardDescription>
              Basado en los parámetros proporcionados
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
            <h3 className="font-semibold text-fitGreen-800 mb-2">Resumen Nutricional</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.calories}</div>
                <div className="text-xs text-gray-500">Calorías</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.protein}g</div>
                <div className="text-xs text-gray-500">Proteínas</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.carbs}g</div>
                <div className="text-xs text-gray-500">Carbohidratos</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.fat}g</div>
                <div className="text-xs text-gray-500">Grasas</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="day-0" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              {generatedDiet.days.map((day, index) => (
                <TabsTrigger key={index} value={`day-${index}`}>{day.name}</TabsTrigger>
              ))}
            </TabsList>
            
            {generatedDiet.days.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={`day-${dayIndex}`} className="space-y-6">
                {day.meals.map((meal, mealIndex) => (
                  <Card key={mealIndex}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Salad className="h-5 w-5 text-fitGreen-600 mr-2" />
                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                      </div>
                      <CardDescription className="flex space-x-4 text-xs mt-1">
                        <span>Calorías: {meal.macros.calories}</span>
                        <span>P: {meal.macros.protein}g</span>
                        <span>C: {meal.macros.carbs}g</span>
                        <span>G: {meal.macros.fat}g</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex} className="text-sm">{food}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Recomendaciones generales</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Mantén una buena hidratación. Se recomienda beber al menos 2 litros de agua al día.</li>
              <li>Intenta establecer horarios regulares para tus comidas.</li>
              <li>Mastica lentamente para mejorar la digestión y favorecer la sensación de saciedad.</li>
              <li>Limita el consumo de alimentos procesados y bebidas azucaradas.</li>
              <li>Si tienes cualquier duda o malestar, consulta con tu nutricionista.</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
            <h3 className="font-semibold text-fitGreen-800 mb-2">Lista de compra</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-1">Proteínas</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Pechuga de pollo (300g)</li>
                  <li>Salmón (300g)</li>
                  <li>Atún en conserva</li>
                  <li>Carne magra (300g)</li>
                  <li>Huevos (1 docena)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Carbohidratos</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Pan integral</li>
                  <li>Arroz integral</li>
                  <li>Quinoa</li>
                  <li>Batatas</li>
                  <li>Plátanos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Frutas y Verduras</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Espinacas</li>
                  <li>Brócoli</li>
                  <li>Tomates</li>
                  <li>Aguacates</li>
                  <li>Manzanas</li>
                  <li>Espárragos</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          Modificar parámetros
        </Button>
        <Button className="flex-1 bg-fitGreen-600 hover:bg-fitGreen-700">
          Guardar plan dietético
        </Button>
      </div>
    </div>
  );
};
