
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Salad, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Empty state for when there are no diet plans yet
const EmptyState = () => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="rounded-full bg-fitBlue-100 p-3">
        <Salad className="h-8 w-8 text-fitBlue-600" />
      </div>
      <h3 className="text-lg font-medium">No hay planes dietéticos</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Aún no se han creado planes dietéticos. Crea un nuevo plan para asignarlo a tus clientes.
      </p>
      <Link 
        to="/diets/new" 
        className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nuevo Plan Dietético
      </Link>
    </div>
  </Card>
);

const Diets = () => {
  // We'll replace this with real data in the future
  const clientDiets = [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Planes Dietéticos</h1>
          <Link 
            to="/diets/new" 
            className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Salad className="mr-2 h-4 w-4" />
            Nuevo Plan Dietético
          </Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Gestiona todos los planes alimenticios asignados a tus clientes
        </p>
        
        <div className="space-y-6">
          {clientDiets.length > 0 ? (
            clientDiets.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="bg-fitBlue-50 dark:bg-fitBlue-900/30 px-6 py-4">
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription>
                    {client.diets.length} {client.diets.length === 1 ? 'plan dietético' : 'planes dietéticos'} asignados
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {client.diets.map((diet) => (
                      <div 
                        key={diet.id} 
                        className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => console.log(`Ver detalles de dieta ${diet.id}`)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{diet.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Desde: {diet.startDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={diet.status === "Activa" ? "default" : "secondary"}>
                            {diet.status}
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

export default Diets;
