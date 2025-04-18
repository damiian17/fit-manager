
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChevronLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { saveClient, saveWorkout, getClientById } from "@/utils/clientStorage";
import { ClientSelector } from "@/components/workout-generator/ClientSelector";
import { PhysicalInfoInputs } from "@/components/workout-generator/PhysicalInfoInputs";
import { WorkoutPreferences } from "@/components/workout-generator/WorkoutPreferences";
import { ScheduleAndEquipment } from "@/components/workout-generator/ScheduleAndEquipment";
import { WorkoutDisplay } from "@/components/workout-generator/WorkoutDisplay";

const WorkoutGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    workoutName: "",
    age: "",
    weight: "",
    height: "",
    fitnessLevel: "",
    workoutType: "",
    goals: "",
    limitations: "",
    daysPerWeek: [] as string[],
    duration: "",
    equipment: [] as string[],
  });
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = async (name: string, value: string) => {
    if (name === "clientId" && value !== "nuevo") {
      const selectedClient = await getClientById(value);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientId: value,
          clientName: selectedClient.name,
          age: selectedClient.age?.toString() || "",
          weight: selectedClient.weight || "",
          height: selectedClient.height || "",
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const newDays = prev.daysPerWeek.includes(day)
        ? prev.daysPerWeek.filter(d => d !== day)
        : [...prev.daysPerWeek, day];
      return { ...prev, daysPerWeek: newDays };
    });
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => {
      const newEquipment = prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment];
      return { ...prev, equipment: newEquipment };
    });
  };

  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.weight || !formData.height || !formData.fitnessLevel || !formData.workoutType || !formData.workoutName) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.clientId === "nuevo" && !formData.clientName) {
      toast.error("Por favor ingresa el nombre del cliente");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://primary-production-d78e.up.railway.app/webhook-test/b7c2f6e2-cb34-4f05-971b-2524335d4d48", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      setGeneratedWorkout(data);
      setWorkoutGenerated(true);
      toast.success("Rutina generada correctamente");
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Error al generar la rutina");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkout = async () => {
    try {
      let clientId: string;
      
      if (formData.clientId === "nuevo") {
        if (!formData.clientName) {
          toast.error("Es necesario proporcionar un nombre para el nuevo cliente");
          return;
        }
        
        const newClient = {
          name: formData.clientName,
          email: "",
          phone: "",
          status: "active",
        };
        
        const savedClient = await saveClient(newClient);
        clientId = savedClient.id;
        toast.success(`Nuevo cliente "${formData.clientName}" creado`);
      } else if (formData.clientId) {
        clientId = formData.clientId;
        
        const client = await getClientById(clientId);
        if (!client) {
          toast.error("No se encontró el cliente seleccionado");
          return;
        }
      } else {
        toast.error("Es necesario seleccionar o crear un cliente");
        return;
      }
      
      const newWorkout = {
        name: formData.workoutName,
        clientId: clientId,
        clientName: formData.clientName,
        createdAt: new Date().toISOString(),
        workout_data: generatedWorkout,
        form_data: formData,
      };
      
      await saveWorkout(newWorkout);
      toast.success(`Rutina "${formData.workoutName}" guardada para ${formData.clientName || "el cliente"}`);
      navigate("/workouts");
    } catch (error) {
      console.error("Error al guardar la rutina:", error);
      toast.error("Hubo un error al guardar la rutina");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/workouts")} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Generador de Rutinas</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!workoutGenerated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Parámetros de la Rutina</CardTitle>
                  <CardDescription>
                    Completa la siguiente información para generar una rutina personalizada. Los campos marcados con * son obligatorios.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateWorkout} className="space-y-6">
                    <ClientSelector 
                      formData={formData} 
                      handleChange={handleChange}
                      handleSelectChange={handleSelectChange}
                    />
                    
                    <PhysicalInfoInputs 
                      formData={formData}
                      handleChange={handleChange}
                    />
                    
                    <WorkoutPreferences 
                      formData={formData}
                      handleChange={handleChange}
                      handleSelectChange={handleSelectChange}
                    />
                    
                    <ScheduleAndEquipment 
                      formData={formData}
                      handleChange={handleChange}
                      toggleDay={toggleDay}
                      toggleEquipment={toggleEquipment}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-fitBlue-600 hover:bg-fitBlue-700" 
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando rutina...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generar Rutina
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <WorkoutDisplay 
                formData={formData}
                generatedWorkout={generatedWorkout}
                onModifyParams={() => setWorkoutGenerated(false)}
                onSaveWorkout={handleSaveWorkout}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consejos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitBlue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Para principiantes, recomienda 2-3 días de entrenamiento por semana con descanso entre sesiones.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitBlue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Para hipertrofia, el rango de repeticiones óptimo suele estar entre 8-12 repeticiones.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitBlue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Para pérdida de peso, combina entrenamiento de fuerza con cardio de alta intensidad (HIIT).
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitBlue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Espec

ifica limitaciones físicas para evitar ejercicios contraindicados.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ejercicios Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="font-medium">Sentadillas</span>
                    <Badge className="bg-fitBlue-100 text-fitBlue-800 hover:bg-fitBlue-100">Piernas</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="font-medium">Press de banca</span>
                    <Badge className="bg-fitBlue-100 text-fitBlue-800 hover:bg-fitBlue-100">Pecho</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="font-medium">Dominadas</span>
                    <Badge className="bg-fitBlue-100 text-fitBlue-800 hover:bg-fitBlue-100">Espalda</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="font-medium">Peso muerto</span>
                    <Badge className="bg-fitBlue-100 text-fitBlue-800 hover:bg-fitBlue-100">Completo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="font-medium">Burpees</span>
                    <Badge className="bg-fitBlue-100 text-fitBlue-800 hover:bg-fitBlue-100">Cardio</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutGenerator;
