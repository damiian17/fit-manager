import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Salad, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Diet, getDietById } from "@/services/supabaseService";
import { DietDetailView } from "@/components/client-portal/DietDetailView";
import { supabase } from "@/integrations/supabase/client";
import { InviteCodeGenerator } from "@/components/trainer/InviteCodeGenerator";

const ClientsHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Clientes</h1>
    <Link
      to="/clients/new"
      className="bg-fitBlue-600 hover:bg-fitBlue-700 text-white px-4 py-2 rounded-md flex items-center"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Nuevo Cliente
    </Link>
  </div>
);

const ClientsTable = () => (
  <Card>
    <CardHeader>
      <CardTitle>Lista de Clientes</CardTitle>
      <CardDescription>
        Aquí puedes ver y gestionar todos tus clientes
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>Tabla de clientes aquí...</p>
    </CardContent>
  </Card>
);

const ActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Acciones</CardTitle>
      <CardDescription>
        Opciones rápidas para gestionar tus clientes
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>Acciones aquí...</p>
    </CardContent>
  </Card>
);

const Clients = () => {
  const [clientDiets, setClientDiets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);

  useEffect(() => {
    // Aquí puedes cargar la información de los clientes desde tu base de datos
    // y actualizar el estado 'clientDiets' con esa información.
    // Por ahora, simularemos una carga exitosa.
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ClientsHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ClientsTable />
            </div>
            <div className="space-y-6">
              <InviteCodeGenerator />
              <ActionsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;
