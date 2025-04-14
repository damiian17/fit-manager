
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Datos de ejemplo para demostración
const mockClients = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    workouts: [
      { id: 101, name: "Rutina de Fuerza - Fase 1", startDate: "15/04/2025", status: "Activa" },
      { id: 102, name: "Rutina de Definición", startDate: "20/03/2025", status: "Completada" }
    ]
  },
  {
    id: 2,
    name: "María Gómez",
    workouts: [
      { id: 201, name: "Rutina de Hipertrofia", startDate: "10/04/2025", status: "Activa" }
    ]
  },
  {
    id: 3,
    name: "Juan Pérez",
    workouts: [
      { id: 301, name: "Rutina de Resistencia", startDate: "05/04/2025", status: "Activa" },
      { id: 302, name: "Rutina de Rehabilitación", startDate: "01/03/2025", status: "Completada" },
      { id: 303, name: "Rutina de Movilidad", startDate: "15/02/2025", status: "Completada" }
    ]
  }
];

const Workouts = () => {
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
          {mockClients.map((client) => (
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
                          Desde: {workout.startDate}
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Workouts;
