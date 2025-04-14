
import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientDiets } from "@/components/trainer/ClientDiets";
import { ClientWorkouts } from "@/components/trainer/ClientWorkouts";
import { Users, Dumbbell, Salad } from "lucide-react";

const Trainer = () => {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Panel del Entrenador</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="clients" className="py-3">
              <Users className="mr-2 h-5 w-5" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="workouts" className="py-3">
              <Dumbbell className="mr-2 h-5 w-5" />
              Rutinas
            </TabsTrigger>
            <TabsTrigger value="diets" className="py-3">
              <Salad className="mr-2 h-5 w-5" />
              Dietas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            <div className="space-y-6">
              {/* Aquí iría el contenido de clientes */}
              <p className="text-center text-gray-500 py-10">
                Selecciona "Rutinas" o "Dietas" para ver la información por cliente
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="workouts">
            <div className="space-y-6">
              <ClientWorkouts />
            </div>
          </TabsContent>
          
          <TabsContent value="diets">
            <div className="space-y-6">
              <ClientDiets />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Trainer;
