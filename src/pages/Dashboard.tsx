
import { Navigation } from "@/components/ui/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
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
        
        <QuickActions />
        
        {/* Empty state for recent clients */}
        <Card className="text-center p-6 mb-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <h3 className="text-lg font-medium">No hay clientes registrados</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Empieza añadiendo nuevos clientes a tu plataforma para gestionar sus rutinas y dietas.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
