import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getWorkouts, getClientById } from "@/utils/clientStorage";
import { toast } from "sonner";
import { Workout } from "@/services/supabaseService";
import { WorkoutDetailView } from "@/components/client-portal/WorkoutDetailView";

const EmptyState = () => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="rounded-full bg-fitBlue-100 p-3">
        <Dumbbell className="h-8 w-8 text-fitBlue-600" />
      </div>
      <h3 className="text-lg font-medium">No hay rutinas de entrenamiento</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Aún no se han creado rutinas de entrenamiento. Crea una nueva rutina para asignarla a tus clientes.
      </p>
      <Link 
        to="/workouts/new" 
        className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nueva Rutina
      </Link>
    </div>
  </Card>
);

interface GroupedWorkouts {
  id: number | string;
  name: string;
  workouts: Workout[];
}

const Workouts = () => {
  const [clientWorkouts, setClientWorkouts] = useState<GroupedWorkouts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        
        const workouts = await getWorkouts();
        
        const groupedWorkouts: { [key: string]: GroupedWorkouts } = {};
        
        for (const workout of workouts) {
          const clientId = workout.client_id.toString();
          
          if (!groupedWorkouts[clientId]) {
            const client = await getClientById(clientId);
            
            groupedWorkouts[clientId] = {
              id: clientId,
              name: client ? client.name : `Cliente ${clientId}`,
              workouts: []
            };
          }
          
          groupedWorkouts[clientId].workouts.push(workout);
        }
        
        setClientWorkouts(Object.values(groupedWorkouts));
      } catch (error) {
        console.error("Error loading workouts:", error);
        toast.error("Error al cargar las rutinas de entrenamiento");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkouts();
  }, []);

  const handleViewWorkoutDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleBackFromDetails = () => {
    setSelectedWorkout(null);
  };

  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    if (!updatedWorkout) return;
    
    const updatedClientWorkouts = clientWorkouts.map(client => {
      if (client.id.toString() === updatedWorkout.client_id) {
        const updatedWorkouts = client.workouts.map(workout => 
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        );
        
        return {
          ...client,
          workouts: updatedWorkouts
        };
      }
      return client;
    });
    
    setClientWorkouts(updatedClientWorkouts);
    setSelectedWorkout(updatedWorkout);
  };

  const handleDeleteWorkout = () => {
    setSelectedWorkout(null);
    loadWorkouts();
  };

  if (selectedWorkout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WorkoutDetailView 
            workout={selectedWorkout} 
            onBack={handleBackFromDetails}
            onUpdate={handleWorkoutUpdate}
            onDelete={handleDeleteWorkout}
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rutinas de Entrenamiento</h1>
          <Link 
            to="/workouts/new" 
            className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Nueva Rutina
          </Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Gestiona todas las rutinas de entrenamiento asignadas a tus clientes
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Cargando rutinas de entrenamiento...</p>
          </div>
        ) : clientWorkouts.length > 0 ? (
          <div className="space-y-6">
            {clientWorkouts.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="bg-fitBlue-50 dark:bg-fitBlue-900/30 px-6 py-4">
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription>
                    {client.workouts.length} {client.workouts.length === 1 ? 'rutina' : 'rutinas'} asignadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {client.workouts.map((workout) => (
                      <div 
                        key={workout.id} 
                        className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleViewWorkoutDetails(workout)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{workout.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Desde: {new Date(workout.created_at).toLocaleDateString()}
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

export default Workouts;
