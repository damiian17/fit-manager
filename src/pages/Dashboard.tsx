
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsCardGrid } from "@/components/dashboard/StatsCardGrid";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { getClients, getStats } from "@/utils/clientStorage";

// Type for client data
interface ClientData {
  id: number;
  name: string;
  goal: string;
  level: string;
  lastVisit: string;
}

const Dashboard = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeWorkouts: 0,
    activeDiets: 0,
    completedSessions: 0
  });

  useEffect(() => {
    // Load clients from storage
    const loadedClients = getClients();
    
    // Transform to the expected format for RecentClients
    const recentClients = loadedClients.slice(0, 5).map(client => ({
      id: client.id,
      name: client.name,
      goal: client.goals || "No especificado",
      level: client.fitnessLevel || "No especificado",
      lastVisit: "Nuevo cliente"
    }));
    
    setClients(recentClients);
    
    // Load stats
    const appStats = getStats();
    setStats(appStats);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container">
        <DashboardHeader title="Dashboard" />
        
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bienvenido a Fit Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gestiona tus clientes, crea rutinas de entrenamiento personalizadas y diseña planes dietéticos a medida.
            </p>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <StatsCardGrid stats={stats} />
        
        <QuickActions />
        
        {clients.length > 0 ? (
          <RecentClients clients={clients} />
        ) : (
          <Card className="text-center p-6 mb-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <h3 className="text-lg font-medium">No hay clientes registrados</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Empieza añadiendo nuevos clientes a tu plataforma para gestionar sus rutinas y dietas.
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
