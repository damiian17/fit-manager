
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const NutritionalTips = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consejos Nutricionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Para pérdida de peso, crea un déficit calórico moderado de 300-500 calorías por día.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Para ganancia muscular, aumenta la ingesta de proteínas a 1.6-2.2g por kg de peso corporal.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Distribuye las proteínas a lo largo del día para maximizar la síntesis proteica muscular.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Prioriza alimentos enteros y no procesados para optimizar la salud y el rendimiento.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alimentos Recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="font-medium mb-1">Fuentes de Proteínas</h4>
              <p className="text-xs text-gray-500">
                Pechuga de pollo, claras de huevo, atún, lentejas, tofu, queso cottage
              </p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="font-medium mb-1">Carbohidratos Complejos</h4>
              <p className="text-xs text-gray-500">
                Avena, arroz integral, quinoa, boniato, legumbres, frutas
              </p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="font-medium mb-1">Grasas Saludables</h4>
              <p className="text-xs text-gray-500">
                Aguacate, aceite de oliva, frutos secos, semillas, salmón
              </p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="font-medium mb-1">Verduras de Hoja Verde</h4>
              <p className="text-xs text-gray-500">
                Espinacas, kale, rúcula, acelgas, lechuga
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
