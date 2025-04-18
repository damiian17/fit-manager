import { useState } from "react";
import { Workout } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, BarChart3, Save, Trash2, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { WorkoutDay } from "@/components/workout-generator/WorkoutDay";
import { DayWorkout, ExerciseData } from "@/types/workout";
import { toast } from "sonner";
import { updateWorkout } from "@/utils/clientStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutDetailViewProps {
  workout: Workout;
  onBack: () => void;
  onUpdate?: (updatedWorkout: Workout) => void;
  onDelete?: () => void;
  isClientView?: boolean;
  onRequestChange?: (message: string) => void;
}

export const WorkoutDetailView = ({ 
  workout, 
  onBack, 
  onUpdate, 
  onDelete, 
  isClientView = false,
  onRequestChange 
}: WorkoutDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseData | null>(null);
  const [editingDayIndex, setEditingDayIndex] = useState<number>(0);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number>(0);
  const [workoutData, setWorkoutData] = useState<Workout>(workout);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRequestChangeDialogOpen, setIsRequestChangeDialogOpen] = useState(false);
  const [changeRequestMessage, setChangeRequestMessage] = useState("");
  
  const extractWorkoutDays = (): DayWorkout[] => {
    if (!workoutData.workout_data) {
      console.log("No workout data available:", workoutData);
      return [];
    }
    
    // Handle both formats: array or nested object
    if (Array.isArray(workoutData.workout_data.output)) {
      return workoutData.workout_data.output;
    } else if (typeof workoutData.workout_data.output === 'object') {
      const output = workoutData.workout_data.output;
      const keys = Object.keys(output);
      
      for (const key of keys) {
        if (Array.isArray(output[key]) && output[key].length > 0) {
          return output[key];
        }
      }
    }
    
    console.log("No workout days found in:", workoutData.workout_data);
    return [];
  };
  
  const workoutDays = extractWorkoutDays();
  console.log("Extracted workout days:", workoutDays);
  
  const formData = workoutData.form_data || {};
  
  const workoutType = formData.workoutType || "General";
  const duration = formData.duration || "N/A";
  const level = formData.fitnessLevel || "Intermedio";
  const goal = formData.goals || "Mantenimiento";
  
  const handleEditExercise = (dayIndex: number, exerciseIndex: number) => {
    if (workoutDays.length > dayIndex && workoutDays[dayIndex].Ejercicios.length > exerciseIndex) {
      setEditingDayIndex(dayIndex);
      setEditingExerciseIndex(exerciseIndex);
      setEditingExercise({...workoutDays[dayIndex].Ejercicios[exerciseIndex]});
      setIsEditing(true);
    }
  };
  
  const handleSaveExercise = async () => {
    if (!editingExercise) return;
    
    try {
      const updatedWorkoutData = {...workoutData};
      
      // Make sure workout_data and output exist
      if (!updatedWorkoutData.workout_data) {
        updatedWorkoutData.workout_data = { output: {} };
      }
      
      if (!updatedWorkoutData.workout_data.output) {
        updatedWorkoutData.workout_data.output = {};
      }
      
      // Find the correct key in the output
      const output = updatedWorkoutData.workout_data.output;
      const keys = Object.keys(output);
      let targetKey = '';
      
      for (const key of keys) {
        if (Array.isArray(output[key]) && output[key].length > 0) {
          targetKey = key;
          break;
        }
      }
      
      if (!targetKey) {
        toast.error("Error al actualizar: No se encontró el formato correcto de datos");
        return;
      }
      
      // Update the exercise
      if (updatedWorkoutData.workout_data.output[targetKey][editingDayIndex] && 
          updatedWorkoutData.workout_data.output[targetKey][editingDayIndex].Ejercicios) {
        updatedWorkoutData.workout_data.output[targetKey][editingDayIndex].Ejercicios[editingExerciseIndex] = editingExercise;
      } else {
        toast.error("Error al actualizar: No se pudo encontrar el ejercicio");
        return;
      }
      
      console.log("Updating workout with data:", updatedWorkoutData);
      
      const updated = await updateWorkout(updatedWorkoutData);
      
      setWorkoutData(updated);
      setIsEditing(false);
      setEditingExercise(null);
      
      if (onUpdate) {
        onUpdate(updated);
      }
      
      toast.success("Ejercicio actualizado correctamente");
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Error al actualizar el ejercicio");
    }
  };
  
  const handleInputChange = (field: keyof ExerciseData, value: string) => {
    if (editingExercise) {
      setEditingExercise({
        ...editingExercise,
        [field]: value
      });
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      console.log("Deleting workout with ID:", workout.id);
      
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workout.id);

      if (error) {
        console.error("Error from Supabase:", error);
        toast.error("Error al eliminar la rutina");
        return;
      }

      toast.success("Rutina eliminada correctamente");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Error al eliminar la rutina");
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          {!isClientView ? (
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar rutina
            </Button>
          ) : (
            onRequestChange && (
              <Button 
                variant="outline" 
                onClick={() => setIsRequestChangeDialogOpen(true)}
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Solicitar cambio
              </Button>
            )
          )}
        </div>
        <CardTitle>{workoutData.name}</CardTitle>
        <CardDescription>
          Rutina de entrenamiento personalizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ejercicios</h3>
            {workoutDays.length > 0 ? (
              <div className="space-y-8">
                {workoutDays.map((day, index) => (
                  <WorkoutDay 
                    key={index} 
                    day={day} 
                    dayIndex={index}
                    onEditExercise={!isClientView ? handleEditExercise : undefined}
                    editable={!isClientView}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No hay ejercicios disponibles para esta rutina.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Ejercicio</DialogTitle>
            </DialogHeader>
            
            {editingExercise && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Ejercicio</Label>
                  <Input 
                    id="nombre" 
                    value={editingExercise.Ejercicio} 
                    onChange={(e) => handleInputChange('Ejercicio', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seriesPrevias">Series Previas</Label>
                    <Input 
                      id="seriesPrevias" 
                      value={editingExercise.SeriesPrevias} 
                      onChange={(e) => handleInputChange('SeriesPrevias', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descanso">Descanso</Label>
                    <Input 
                      id="descanso" 
                      value={editingExercise.Descanso} 
                      onChange={(e) => handleInputChange('Descanso', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anotaciones">Anotaciones</Label>
                  <Textarea 
                    id="anotaciones" 
                    value={editingExercise.Anotaciones} 
                    onChange={(e) => handleInputChange('Anotaciones', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serie1">Primera Serie</Label>
                    <Input 
                      id="serie1" 
                      value={editingExercise.PrimeraSerie} 
                      onChange={(e) => handleInputChange('PrimeraSerie', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serie2">Segunda Serie</Label>
                    <Input 
                      id="serie2" 
                      value={editingExercise.SegundaSerie} 
                      onChange={(e) => handleInputChange('SegundaSerie', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serie3">Tercera Serie</Label>
                    <Input 
                      id="serie3" 
                      value={editingExercise.TerceraSerie} 
                      onChange={(e) => handleInputChange('TerceraSerie', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rir">RIR</Label>
                  <Input 
                    id="rir" 
                    value={editingExercise.RIR} 
                    onChange={(e) => handleInputChange('RIR', e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button type="button" onClick={handleSaveExercise} className="bg-fitBlue-600 hover:bg-fitBlue-700">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la rutina de entrenamiento. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkout}
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
            <DialogTitle>Solicitar cambio en la rutina</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="changeMessage">Describe los cambios que necesitas</Label>
              <Textarea 
                id="changeMessage" 
                value={changeRequestMessage} 
                onChange={(e) => setChangeRequestMessage(e.target.value)}
                rows={4}
                placeholder="Por favor, explica qué cambios necesitas en esta rutina..."
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
};
