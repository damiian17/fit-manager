
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Dumbbell, Salad, ArrowRight, LogIn, UserPlus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getClientByEmail, getClientDiets, getClientWorkouts, type Diet, type Workout } from "@/services/supabaseService";
import { DietCard } from "@/components/client-portal/DietCard";
import { WorkoutCard } from "@/components/client-portal/WorkoutCard";
import { DietDetailView } from "@/components/client-portal/DietDetailView";
import { WorkoutDetailView } from "@/components/client-portal/WorkoutDetailView";

const ClientPortal = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workouts");
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  const navigate = useNavigate();
  
  // Check if user exists in client storage
  useEffect(() => {
    const hasLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
    const clientEmail = localStorage.getItem('clientEmail');
    
    const fetchClientData = async () => {
      setIsLoading(true);
      if (hasLoggedIn && clientEmail) {
        try {
          // Fetch client data from Supabase
          const client = await getClientByEmail(clientEmail);
          
          if (client) {
            setClientData(client);
            setIsNewUser(false);
            
            // Fetch client diets
            const clientDiets = await getClientDiets(client.id);
            setDiets(clientDiets);
            
            // Fetch client workouts
            const clientWorkouts = await getClientWorkouts(client.id);
            setWorkouts(clientWorkouts);
          } else {
            // No client found in Supabase, redirect to registration
            navigate('/client-register');
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
          toast.error("Error al cargar los datos del cliente");
        }
      } else {
        setIsNewUser(true);
      }
      setIsLoading(false);
    };
    
    fetchClientData();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('clientLoggedIn');
    localStorage.removeItem('clientEmail');
    toast.success("Sesión cerrada correctamente");
    navigate('/login');
  };
  
  const handleViewDietDetails = (diet: Diet) => {
    setSelectedDiet(diet);
  };
  
  const handleViewWorkoutDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
  };
  
  const handleBackToList = () => {
    setSelectedDiet(null);
    setSelectedWorkout(null);
  };
  
  const renderDietContent = () => {
    if (selectedDiet) {
      return <DietDetailView diet={selectedDiet} onBack={handleBackToList} />;
    }
    
    if (diets.length === 0) {
      return (
        <div className="text-center py-8">
          <Salad className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No tienes dietas asignadas</h3>
          <p className="text-sm text-gray-500 mt-2">
            Tu entrenador te asignará dietas personalizadas pronto
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diets.map((diet) => (
          <DietCard 
            key={diet.id} 
            diet={diet} 
            onViewDetails={handleViewDietDetails} 
          />
        ))}
      </div>
    );
  };
  
  const renderWorkoutContent = () => {
    if (selectedWorkout) {
      return <WorkoutDetailView workout={selectedWorkout} onBack={handleBackToList} />;
    }
    
    if (workouts.length === 0) {
      return (
        <div className="text-center py-8">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No tienes rutinas asignadas</h3>
          <p className="text-sm text-gray-500 mt-2">
            Tu entrenador te asignará rutinas personalizadas pronto
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workouts.map((workout) => (
          <WorkoutCard 
            key={workout.id} 
            workout={workout} 
            onViewDetails={handleViewWorkoutDetails} 
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 grid place-items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fitBlue-700">Portal del Cliente</h1>
          <p className="text-gray-600 mt-2">Accede a tus rutinas y dietas personalizadas</p>
        </div>
        
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Cargando datos...</p>
            </CardContent>
          </Card>
        ) : isNewUser ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>¡Bienvenido al Portal de Clientes!</CardTitle>
              <CardDescription>
                Para comenzar, crea una cuenta de cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-center max-w-md mb-4">
                Al registrarte, tu entrenador podrá crear planes personalizados adaptados a tus 
                necesidades y objetivos específicos.
              </p>
              <Link to="/login">
                <Button className="bg-fitBlue-600 hover:bg-fitBlue-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                ¿No tienes una cuenta? <Link to="/login" className="text-fitBlue-600 hover:underline">Regístrate</Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mi Panel de Cliente</CardTitle>
                <CardDescription>
                  {clientData?.name ? `Bienvenido, ${clientData.name}` : 'Aquí puedes ver tus rutinas y dietas asignadas'}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="workouts">Mis Rutinas</TabsTrigger>
                  <TabsTrigger value="diets">Mis Dietas</TabsTrigger>
                </TabsList>
                <TabsContent value="workouts" className="mt-4">
                  {renderWorkoutContent()}
                </TabsContent>
                <TabsContent value="diets" className="mt-4">
                  {renderDietContent()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;
