
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Salad, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Datos de ejemplo para demostración
const mockClients = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    diets: [
      { id: 101, name: "Plan Pérdida de Peso - Fase 1", startDate: "15/04/2025", status: "Activa" },
      { id: 102, name: "Dieta de Mantenimiento", startDate: "20/03/2025", status: "Completada" }
    ]
  },
  {
    id: 2,
    name: "María Gómez",
    diets: [
      { id: 201, name: "Dieta Volumen", startDate: "10/04/2025", status: "Activa" }
    ]
  },
  {
    id: 3,
    name: "Juan Pérez",
    diets: [
      { id: 301, name: "Dieta Cetogénica", startDate: "05/04/2025", status: "Activa" },
      { id: 302, name: "Dieta Baja en Carbohidratos", startDate: "01/03/2025", status: "Completada" }
    ]
  }
];

const Diets = () => {
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
          {mockClients.map((client) => (
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Diets;
