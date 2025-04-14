
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getWorkouts, getClientById } from "@/utils/clientStorage";
import { toast } from "sonner";

// Empty state for when there are no workout routines yet
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
  workouts: any[];
}

const Workouts = () => {
  const [clientWorkouts, setClientWorkouts] = useState<GroupedWorkouts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load workouts from Supabase
    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        
        // Get all workouts
        const workouts = await getWorkouts();
        
        // Group workouts by client
        const groupedWorkouts: { [key: string]: GroupedWorkouts } = {};
        
        // Process each workout
        for (const workout of workouts) {
          const clientId = workout.clientId.toString();
          
          if (!groupedWorkouts[clientId]) {
            // Fetch client information
            const client = await getClientById(clientId);
            
            groupedWorkouts[clientId] = {
              id: clientId,
              name: client ? client.name : `Cliente ${clientId}`,
              workouts: []
            };
          }
          
          groupedWorkouts[clientId].workouts.push(workout);
        }
        
        // Convert grouped workouts object to array
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
        
        <div className="space-y-6">
          {clientWorkouts.length > 0 ? (
            clientWorkouts.map((client) => (
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
                        onClick={() => console.log(`Ver detalles de rutina ${workout.id}`)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{workout.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Desde: {new Date(workout.startDate || workout.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={workout.status === "Activa" ? "default" : "secondary"}>
                            {workout.status}
                          </Badge>
                          <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
};

export default Workouts;
