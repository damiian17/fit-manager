
import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCardGrid } from "@/components/dashboard/StatsCardGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { NotificationsCard } from "@/components/dashboard/NotificationsCard";
import { UpcomingBirthdays } from "@/components/dashboard/UpcomingBirthdays";

// Sample data for demonstration
const recentClients = [
  { id: 1, name: "Ana García", goal: "Pérdida de peso", level: "Principiante", lastVisit: "Hace 2 días" },
  { id: 2, name: "Carlos Pérez", goal: "Ganancia muscular", level: "Intermedio", lastVisit: "Hace 1 semana" },
  { id: 3, name: "Laura Sánchez", goal: "Tonificación", level: "Avanzado", lastVisit: "Ayer" },
  { id: 4, name: "Javier Rodríguez", goal: "Rendimiento", level: "Intermedio", lastVisit: "Hoy" },
];

const upcomingBirthdays = [
  { id: 1, name: "Ana García", date: "23 Abril" },
  { id: 2, name: "Carlos Pérez", date: "28 Abril" },
  { id: 3, name: "Laura Sánchez", date: "2 Mayo" },
];

const Dashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Ana García ha completado su rutina semanal", date: "Hace 1 hora" },
    { id: 2, text: "Nuevo cliente registrado: Javier Rodríguez", date: "Hace 2 horas" },
    { id: 3, text: "Recordatorio: Actualizar plan de dieta para Laura", date: "Hace 1 día" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container">
        <DashboardHeader title="Dashboard" />
        <StatsCardGrid />
        <QuickActions />

        {/* Recent Clients & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentClients clients={recentClients} />
          </div>

          <div className="space-y-6">
            <NotificationsCard notifications={notifications} />
            <UpcomingBirthdays birthdays={upcomingBirthdays} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
