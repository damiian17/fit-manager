
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsCardGrid } from "@/components/dashboard/StatsCardGrid";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { getClients, getStats } from "@/utils/clientStorage";
import { toast } from "sonner";

// Type for client data specifically for the RecentClients component
interface DashboardClientData {
  id: string;
  name: string;
  goal: string;
  level: string;
  lastVisit: string;
}

const Dashboard = () => {
  const [clients, setClients] = useState<DashboardClientData[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeWorkouts: 0,
    activeDiets: 0,
    completedSessions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load clients and stats from Supabase
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load clients
        const loadedClients = await getClients();
        
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
        const appStats = await getStats();
        setStats(appStats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Error al cargar los datos del dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
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
        {isLoading ? (
          <Card className="mb-8 p-6 text-center">
            <p>Cargando estadísticas...</p>
          </Card>
        ) : (
          <StatsCardGrid stats={stats} />
        )}
        
        <QuickActions />
        
        {isLoading ? (
          <Card className="mb-8 p-6 text-center">
            <p>Cargando clientes recientes...</p>
          </Card>
        ) : clients.length > 0 ? (
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
