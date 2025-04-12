
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Sparkles, FileDown, Mail, Dumbbell, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const WorkoutGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
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

  // Sample workout days
  const workoutDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  
  // Sample equipment options
  const equipmentOptions = [
    "Mancuernas", "Barras", "Máquinas de gimnasio", "Bandas elásticas", 
    "Kettlebells", "TRX/Suspensión", "Balón medicinal", "Step", "Ninguno"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    // Validate form
    if (!formData.age || !formData.weight || !formData.height || !formData.fitnessLevel || !formData.workoutType) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setWorkoutGenerated(true);
      toast.success("Rutina generada correctamente");
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Error al generar la rutina");
    } finally {
      setIsGenerating(false);
    }
  };

  // Example generated workout data
  const generatedWorkout = {
    days: [
      {
        name: "Día 1 - Pecho y Tríceps",
        exercises: [
          { name: "Press de banca", sets: 4, reps: "8-10", rest: "90 sec", note: "Aumentar peso gradualmente" },
          { name: "Press inclinado con mancuernas", sets: 3, reps: "10-12", rest: "60 sec" },
          { name: "Aperturas en máquina", sets: 3, reps: "12-15", rest: "60 sec" },
          { name: "Fondos en paralelas", sets: 3, reps: "10-12", rest: "60 sec" },
          { name: "Extensiones de tríceps con polea", sets: 3, reps: "12-15", rest: "60 sec" },
        ]
      },
      {
        name: "Día 2 - Espalda y Bíceps",
        exercises: [
          { name: "Dominadas", sets: 4, reps: "máximas", rest: "90 sec", note: "Usar asistencia si es necesario" },
          { name: "Remo con barra", sets: 3, reps: "8-10", rest: "90 sec" },
          { name: "Remo en máquina", sets: 3, reps: "10-12", rest: "60 sec" },
          { name: "Curl de bíceps con barra", sets: 3, reps: "10-12", rest: "60 sec" },
          { name: "Curl martillo", sets: 3, reps: "12-15", rest: "60 sec" },
        ]
      },
      {
        name: "Día 3 - Piernas",
        exercises: [
          { name: "Sentadillas", sets: 4, reps: "8-10", rest: "120 sec", note: "Mantener la espalda recta" },
          { name: "Prensa de piernas", sets: 3, reps: "10-12", rest: "90 sec" },
          { name: "Extensiones de cuádriceps", sets: 3, reps: "12-15", rest: "60 sec" },
          { name: "Curl femoral", sets: 3, reps: "12-15", rest: "60 sec" },
          { name: "Elevaciones de gemelos", sets: 4, reps: "15-20", rest: "60 sec" },
        ]
      },
    ]
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
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Seleccionar cliente (opcional)</Label>
                      <Select onValueChange={(value) => handleSelectChange("clientId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ana García</SelectItem>
                          <SelectItem value="2">Carlos Pérez</SelectItem>
                          <SelectItem value="3">Laura Sánchez</SelectItem>
                          <SelectItem value="4">Javier Rodríguez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age">Edad *</Label>
                        <Input 
                          id="age" 
                          name="age" 
                          type="number" 
                          placeholder="Ej. 30" 
                          value={formData.age}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg) *</Label>
                        <Input 
                          id="weight" 
                          name="weight" 
                          type="number" 
                          placeholder="Ej. 70" 
                          value={formData.weight}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm) *</Label>
                        <Input 
                          id="height" 
                          name="height" 
                          type="number" 
                          placeholder="Ej. 175" 
                          value={formData.height}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fitnessLevel">Nivel de fitness *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
                          value={formData.fitnessLevel}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">Principiante</SelectItem>
                            <SelectItem value="intermedio">Intermedio</SelectItem>
                            <SelectItem value="avanzado">Avanzado</SelectItem>
                            <SelectItem value="elite">Elite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="workoutType">Tipo de entrenamiento *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("workoutType", value)}
                          value={formData.workoutType}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fuerza">Fuerza</SelectItem>
                            <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                            <SelectItem value="resistencia">Resistencia</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="flexibilidad">Flexibilidad</SelectItem>
                            <SelectItem value="mixto">Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goals">Objetivos específicos</Label>
                      <Textarea 
                        id="goals" 
                        name="goals" 
                        placeholder="Describe los objetivos específicos que se quieren conseguir con esta rutina..." 
                        value={formData.goals}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="limitations">Limitaciones físicas/lesiones (opcional)</Label>
                      <Textarea 
                        id="limitations" 
                        name="limitations" 
                        placeholder="Indica cualquier limitación física o lesión que se deba tener en cuenta..." 
                        value={formData.limitations}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Días disponibles por semana</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {workoutDays.map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day}`}
                              checked={formData.daysPerWeek.includes(day)}
                              onCheckedChange={() => toggleDay(day)}
                            />
                            <label
                              htmlFor={`day-${day}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duración deseada por sesión (minutos)</Label>
                      <Input 
                        id="duration" 
                        name="duration" 
                        type="number" 
                        placeholder="Ej. 60" 
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Equipamiento disponible</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {equipmentOptions.map((equipment) => (
                          <div key={equipment} className="flex items-center space-x-2">
                            <Checkbox
                              id={`equipment-${equipment}`}
                              checked={formData.equipment.includes(equipment)}
                              onCheckedChange={() => toggleEquipment(equipment)}
                            />
                            <label
                              htmlFor={`equipment-${equipment}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {equipment}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-fitBlue-600 hover:bg-fitBlue-700" 
                      disabled={isGenerating}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando rutina...
                        </>
                      ) : (
                        "Generar Rutina"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Rutina Personalizada</CardTitle>
                      <CardDescription>
                        Basada en los parámetros proporcionados
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 p-4 bg-fitBlue-50 border border-fitBlue-100 rounded-lg">
                      <h3 className="font-semibold text-fitBlue-800 mb-2">Resumen de la Rutina</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <li><span className="font-medium">Nivel:</span> {formData.fitnessLevel || "Intermedio"}</li>
                        <li><span className="font-medium">Tipo:</span> {formData.workoutType || "Hipertrofia"}</li>
                        <li><span className="font-medium">Frecuencia:</span> {formData.daysPerWeek.length || 3} días/semana</li>
                        <li><span className="font-medium">Duración:</span> {formData.duration || 60} min/sesión</li>
                      </ul>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {generatedWorkout.days.map((day, index) => (
                        <AccordionItem key={index} value={`day-${index}`}>
                          <AccordionTrigger className="text-left font-semibold">
                            <div className="flex items-center">
                              <Dumbbell className="mr-2 h-5 w-5 text-fitBlue-600" />
                              {day.name}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="py-2 px-4 text-left font-medium">Ejercicio</th>
                                    <th className="py-2 px-4 text-center font-medium">Series</th>
                                    <th className="py-2 px-4 text-center font-medium">Reps</th>
                                    <th className="py-2 px-4 text-center font-medium">Descanso</th>
                                    <th className="py-2 px-4 text-left font-medium">Notas</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {day.exercises.map((exercise, exIndex) => (
                                    <tr key={exIndex} className="border-t border-gray-200 dark:border-gray-700">
                                      <td className="py-3 px-4 font-medium">{exercise.name}</td>
                                      <td className="py-3 px-4 text-center">{exercise.sets}</td>
                                      <td className="py-3 px-4 text-center">{exercise.reps}</td>
                                      <td className="py-3 px-4 text-center">{exercise.rest}</td>
                                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{exercise.note || "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold mb-2">Instrucciones generales</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>Realiza un calentamiento adecuado de 5-10 minutos antes de cada sesión.</li>
                        <li>Comienza con pesos ligeros y aumenta gradualmente a medida que te sientas cómodo.</li>
                        <li>Mantén una técnica adecuada durante todos los ejercicios.</li>
                        <li>Descansa al menos 48 horas entre entrenamientos del mismo grupo muscular.</li>
                        <li>Bebe suficiente agua durante el entrenamiento.</li>
                        <li>Consulta con tu entrenador si tienes alguna duda o malestar.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setWorkoutGenerated(false)}>
                    Modificar parámetros
                  </Button>
                  <Button className="flex-1 bg-fitBlue-600 hover:bg-fitBlue-700">
                    Guardar rutina
                  </Button>
                </div>
              </div>
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
                    Especifica limitaciones físicas para evitar ejercicios contraindicados.
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
