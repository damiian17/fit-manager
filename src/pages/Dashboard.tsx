
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsCardGrid } from "@/components/dashboard/StatsCardGrid";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { NotificationsCard } from "@/components/dashboard/NotificationsCard";
import { getClients, getStats } from "@/utils/clientStorage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

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
  const [trainerId, setTrainerId] = useState<string | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    // Get the trainer ID from the session
    const getCurrentTrainer = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setTrainerId(session.user.id);
      }
    };
    
    getCurrentTrainer();
  }, []);

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

  // Extract notification ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notificationId = params.get('notification');
    
    if (notificationId) {
      // Handle notification viewing if needed
      console.log("Viewing notification:", notificationId);
    }
  }, [location]);

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <QuickActions />
          <NotificationsCard trainerId={trainerId} />
        </div>
        
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
