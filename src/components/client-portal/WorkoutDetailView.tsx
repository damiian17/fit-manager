
import { Workout } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface WorkoutDetailViewProps {
  workout: Workout;
  onBack: () => void;
}

export const WorkoutDetailView = ({ workout, onBack }: WorkoutDetailViewProps) => {
  // Extraer datos de la rutina si existen
  const workoutData = workout.workout_data || {};
  const formData = workout.form_data || {};
  
  // Intentar extraer información relevante
  const workoutType = formData.workoutType || "General";
  const duration = formData.duration || "N/A";
  const level = formData.level || "Intermedio";
  const goal = formData.goal || "Mantenimiento";
  
  // Función para renderizar los ejercicios
  const renderExercises = () => {
    if (!workoutData.exercises || !Array.isArray(workoutData.exercises) || workoutData.exercises.length === 0) {
      return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No hay ejercicios disponibles para esta rutina. La información detallada estará disponible próximamente.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {workoutData.exercises.map((exercise: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{exercise.name || `Ejercicio ${index + 1}`}</CardTitle>
                {exercise.muscleGroup && (
                  <Badge variant="outline" className="bg-fitBlue-50 text-fitBlue-700">
                    {exercise.muscleGroup}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {exercise.description && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1">Descripción:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</p>
                    </div>
                  )}
                  
                  {exercise.instructions && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Instrucciones:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{exercise.instructions}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {exercise.sets && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium w-20">Series:</span>
                      <span className="text-sm">{exercise.sets}</span>
                    </div>
                  )}
                  
                  {exercise.reps && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium w-20">Repeticiones:</span>
                      <span className="text-sm">{exercise.reps}</span>
                    </div>
                  )}
                  
                  {exercise.rest && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium w-20">Descanso:</span>
                      <span className="text-sm">{exercise.rest}</span>
                    </div>
                  )}
                  
                  {exercise.weight && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium w-20">Peso:</span>
                      <span className="text-sm">{exercise.weight}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {exercise.notes && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <h4 className="text-sm font-medium mb-1">Notas:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Función para renderizar secciones de la rutina
  const renderWorkoutSections = () => {
    if (!workoutData.sections || !Array.isArray(workoutData.sections) || workoutData.sections.length === 0) {
      return renderExercises();
    }
    
    return (
      <div className="space-y-8">
        {workoutData.sections.map((section: any, index: number) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-4">{section.name || `Sección ${index + 1}`}</h3>
            {section.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>
            )}
            
            <div className="space-y-4">
              {section.exercises && Array.isArray(section.exercises) ? (
                section.exercises.map((exercise: any, exIndex: number) => (
                  <Card key={exIndex} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{exercise.name || `Ejercicio ${exIndex + 1}`}</CardTitle>
                        {exercise.muscleGroup && (
                          <Badge variant="outline" className="bg-fitBlue-50 text-fitBlue-700">
                            {exercise.muscleGroup}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          {exercise.description && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium mb-1">Descripción:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</p>
                            </div>
                          )}
                          
                          {exercise.instructions && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Instrucciones:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{exercise.instructions}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {exercise.sets && (
                            <div className="flex items-center">
                              <span className="text-sm font-medium w-20">Series:</span>
                              <span className="text-sm">{exercise.sets}</span>
                            </div>
                          )}
                          
                          {exercise.reps && (
                            <div className="flex items-center">
                              <span className="text-sm font-medium w-20">Repeticiones:</span>
                              <span className="text-sm">{exercise.reps}</span>
                            </div>
                          )}
                          
                          {exercise.rest && (
                            <div className="flex items-center">
                              <span className="text-sm font-medium w-20">Descanso:</span>
                              <span className="text-sm">{exercise.rest}</span>
                            </div>
                          )}
                          
                          {exercise.weight && (
                            <div className="flex items-center">
                              <span className="text-sm font-medium w-20">Peso:</span>
                              <span className="text-sm">{exercise.weight}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {exercise.notes && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <h4 className="text-sm font-medium mb-1">Notas:</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                  No hay ejercicios en esta sección
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <CardTitle>{workout.name}</CardTitle>
        <CardDescription>
          Rutina de entrenamiento personalizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Información general de la rutina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-fitBlue-600" />
              <div>
                <p className="text-xs text-gray-500">Tipo</p>
                <p className="font-medium">{workoutType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-fitBlue-600" />
              <div>
                <p className="text-xs text-gray-500">Duración</p>
                <p className="font-medium">{duration}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-fitBlue-600" />
              <div>
                <p className="text-xs text-gray-500">Nivel</p>
                <p className="font-medium">{level}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-fitBlue-600" />
              <div>
                <p className="text-xs text-gray-500">Objetivo</p>
                <p className="font-medium">{goal}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Descripción de la rutina */}
          {workoutData.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Descripción</h3>
              <p className="text-gray-600 dark:text-gray-400">{workoutData.description}</p>
            </div>
          )}
          
          {/* Notas adicionales */}
          {workoutData.notes && (
            <div className="p-4 bg-fitBlue-50 dark:bg-fitBlue-900/20 rounded-lg">
              <h3 className="text-md font-semibold mb-2">Notas importantes</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{workoutData.notes}</p>
            </div>
          )}
          
          {/* Ejercicios o secciones de la rutina */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ejercicios</h3>
            {renderWorkoutSections()}
          </div>
          
          {/* Si no hay datos de ejercicios */}
          {(!workoutData.exercises || workoutData.exercises.length === 0) && 
           (!workoutData.sections || workoutData.sections.length === 0) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-center text-gray-500 dark:text-gray-400">
                Los detalles de esta rutina estarán disponibles próximamente.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
