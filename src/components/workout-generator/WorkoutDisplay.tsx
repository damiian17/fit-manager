
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Mail, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WorkoutDisplayProps {
  formData: {
    workoutName: string;
    clientName: string;
    fitnessLevel: string;
    workoutType: string;
    daysPerWeek: string[];
    duration: string;
  };
  generatedWorkout: any;
  onModifyParams: () => void;
  onSaveWorkout: () => void;
}

export const WorkoutDisplay = ({ 
  formData, 
  generatedWorkout, 
  onModifyParams, 
  onSaveWorkout 
}: WorkoutDisplayProps) => {
  const renderWorkoutSections = () => {
    if (!generatedWorkout) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos de rutina disponibles</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {generatedWorkout.days && generatedWorkout.days.map((day: any, index: number) => (
          <AccordionItem key={index} value={`day-${index}`}>
            <AccordionTrigger className="text-left font-semibold">
              <div className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-fitBlue-600" />
                {day.name || `Día ${index + 1}`}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {day.exercises && day.exercises.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="py-2 px-4 text-left font-medium">Ejercicio</th>
                        <th className="py-2 px-4 text-center font-medium">Series</th>
                        <th className="py-2 px-4 text-center font-medium">Reps</th>
                        <th className="py-2 px-4 text-center font-medium">Descanso</th>
                        <th className="py-2 px-4 text-left font-medium">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((exercise: any, exIndex: number) => (
                        <tr key={exIndex} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 font-medium">{exercise.name}</td>
                          <td className="py-3 px-4 text-center">{exercise.sets}</td>
                          <td className="py-3 px-4 text-center">{exercise.reps}</td>
                          <td className="py-3 px-4 text-center">{exercise.rest}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{exercise.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-3 px-4 text-gray-500">No hay ejercicios disponibles para este día</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {!generatedWorkout.days && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">La rutina ha sido generada pero no tiene un formato reconocible. Revisa la consola para ver la estructura completa.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rutina Personalizada: {formData.workoutName}</CardTitle>
            <CardDescription>
              {formData.clientName ? `Cliente: ${formData.clientName}` : "Sin cliente asignado"} | Basada en los parámetros proporcionados
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
          <div className="mb-6 p-4 bg-fitBlue-50 border border-fitBlue-100 rounded-lg">
            <h3 className="font-semibold text-fitBlue-800 mb-2">Resumen de la Rutina</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <li><span className="font-medium">Nivel:</span> {formData.fitnessLevel || "Intermedio"}</li>
              <li><span className="font-medium">Tipo:</span> {formData.workoutType || "Hipertrofia"}</li>
              <li><span className="font-medium">Frecuencia:</span> {formData.daysPerWeek.length || 3} días/semana</li>
              <li><span className="font-medium">Duración:</span> {formData.duration || 60} min/sesión</li>
            </ul>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {renderWorkoutSections()}
          </Accordion>
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Instrucciones generales</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Realiza un calentamiento adecuado de 5-10 minutos antes de cada sesión.</li>
              <li>Comienza con pesos ligeros y aumenta gradualmente a medida que te sientas cómodo.</li>
              <li>Mantén una técnica adecuada durante todos los ejercicios.</li>
              <li>Descansa al menos 48 horas entre entrenamientos del mismo grupo muscular.</li>
              <li>Bebe suficiente agua durante el entrenamiento.</li>
              <li>Consulta con tu entrenador si tienes alguna duda o malestar.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={onModifyParams}>
          Modificar parámetros
        </Button>
        <Button className="flex-1 bg-fitBlue-600 hover:bg-fitBlue-700" onClick={onSaveWorkout}>
          Guardar rutina
        </Button>
      </div>
    </div>
  );
};
