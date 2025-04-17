
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Dumbbell, Salad, ArrowRight, LogIn, UserPlus, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { getClientByEmail, getClientDiets, getClientWorkouts, type Diet, type Workout } from "@/services/supabaseService";
import { DietCard } from "@/components/client-portal/DietCard";
import { WorkoutCard } from "@/components/client-portal/WorkoutCard";
import { DietDetailView } from "@/components/client-portal/DietDetailView";
import { WorkoutDetailView } from "@/components/client-portal/WorkoutDetailView";
import { getActiveSession } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const ClientPortal = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workouts");
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getActiveSession();
        if (!session) {
          navigate("/login");
          return;
        }
        
        fetchClientData(session.user.email);
      } catch (error) {
        console.error("Error verificando sesión:", error);
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const fetchClientData = async (email: string | undefined) => {
    setIsLoading(true);
    if (!email) {
      setIsLoading(false);
      setIsNewUser(true);
      return;
    }
    
    try {
      const client = await getClientByEmail(email);
      
      if (client) {
        setClientData(client);
        setIsNewUser(false);
        
        const clientDiets = await getClientDiets(client.id);
        setDiets(clientDiets);
        
        const clientWorkouts = await getClientWorkouts(client.id);
        setWorkouts(clientWorkouts);
      } else {
        navigate('/client-register');
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Error al cargar los datos del cliente");
    }
    
    setIsLoading(false);
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('clientLoggedIn');
      localStorage.removeItem('clientEmail');
      localStorage.removeItem('clientUserId');
      localStorage.removeItem('sb-yehxlphlddyzrnewfelr-auth-token');
      
      toast.success("Sesión cerrada correctamente");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
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
  
  const handleGenerateWorkout = async () => {
    const webhookUrl = "https://primary-production-d78e.up.railway.app/webhook-test/b7c2f6e2-cb34-4f05-971b-2524335d4d48";
    
    setIsGeneratingWorkout(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Necessary for cross-origin requests without CORS
        body: JSON.stringify({
          clientId: clientData?.id || "unknown",
          clientName: clientData?.name || "Cliente",
          timestamp: new Date().toISOString(),
          source: "client-portal",
          action: "generate-workout"
        }),
      });
      
      toast.success("Solicitud de rutina enviada correctamente");
      
      // Refresh workouts after a short delay
      setTimeout(() => {
        if (clientData) {
          getClientWorkouts(clientData.id).then(newWorkouts => {
            setWorkouts(newWorkouts);
          });
        }
        setIsGeneratingWorkout(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error al enviar la solicitud al webhook:", error);
      toast.error("Error al solicitar la rutina");
      setIsGeneratingWorkout(false);
    }
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
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Mis Rutinas de Entrenamiento</h3>
          <Button 
            onClick={handleGenerateWorkout} 
            disabled={isGeneratingWorkout}
            className="bg-fitBlue-600 hover:bg-fitBlue-700"
          >
            {isGeneratingWorkout ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generar Rutina
              </>
            )}
          </Button>
        </div>
        
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No tienes rutinas asignadas</h3>
            <p className="text-sm text-gray-500 mt-2">
              Tu entrenador te asignará rutinas personalizadas pronto
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onViewDetails={handleViewWorkoutDetails} 
              />
            ))}
          </div>
        )}
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
