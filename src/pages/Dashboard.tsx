
import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Dumbbell, 
  Salad, 
  CalendarCheck, 
  Bell, 
  TrendingUp, 
  UserPlus, 
  FileText, 
  BarChart3,
  Plus 
} from "lucide-react";
import { Link } from "react-router-dom";

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <div className="flex space-x-2">
            <Button className="bg-fitBlue-600 hover:bg-fitBlue-700">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </Button>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-stats overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Total Clientes</p>
                  <p className="stat-value">128</p>
                </div>
                <div className="rounded-full p-3 bg-fitBlue-100">
                  <Users className="h-6 w-6 text-fitBlue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+8% este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Rutinas Activas</p>
                  <p className="stat-value">42</p>
                </div>
                <div className="rounded-full p-3 bg-fitBlue-100">
                  <Dumbbell className="h-6 w-6 text-fitBlue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+12% este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Dietas Activas</p>
                  <p className="stat-value">36</p>
                </div>
                <div className="rounded-full p-3 bg-fitBlue-100">
                  <Salad className="h-6 w-6 text-fitBlue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+5% este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Sesiones Completadas</p>
                  <p className="stat-value">96</p>
                </div>
                <div className="rounded-full p-3 bg-fitBlue-100">
                  <CalendarCheck className="h-6 w-6 text-fitBlue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+15% este mes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/clients/new">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <UserPlus className="h-12 w-12 text-fitBlue-600 mb-4" />
                <h3 className="text-lg font-semibold">Nuevo Cliente</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Registra un nuevo cliente en el sistema
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/workouts/new">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Dumbbell className="h-12 w-12 text-fitBlue-600 mb-4" />
                <h3 className="text-lg font-semibold">Nueva Rutina</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Crea una rutina de entrenamiento personalizada
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/diets/new">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Salad className="h-12 w-12 text-fitBlue-600 mb-4" />
                <h3 className="text-lg font-semibold">Nuevo Plan Dietético</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Genera un plan alimenticio personalizado
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Clients & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Clientes Recientes</CardTitle>
                  <Link to="/clients">
                    <Button variant="ghost" size="sm" className="text-fitBlue-600">
                      Ver todos
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Actividad reciente de tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.goal} • {client.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-4">{client.lastVisit}</span>
                        <Button variant="ghost" size="sm" className="text-fitBlue-600">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Actualizaciones recientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Próximos Cumpleaños</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingBirthdays.map((client) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{client.name}</span>
                      </div>
                      <span className="text-xs bg-fitBlue-100 text-fitBlue-800 py-1 px-2 rounded-full">
                        {client.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
