
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dumbbell, Salad, Calendar, Clock, Activity, Info } from "lucide-react";

// Datos de ejemplo para demostración - en una aplicación real, estos vendrían de una base de datos
const mockWorkouts = [
  {
    id: 1, 
    name: "Rutina de Fuerza - Fase 1", 
    type: "Fuerza", 
    frequency: "3 días/semana", 
    startDate: "15/04/2025", 
    endDate: "15/05/2025",
    status: "Activa"
  },
  {
    id: 2, 
    name: "Rutina de Definición", 
    type: "Hipertrofia", 
    frequency: "4 días/semana", 
    startDate: "20/03/2025", 
    endDate: "20/04/2025",
    status: "Completada"
  }
];

const mockDiets = [
  {
    id: 1, 
    name: "Plan Pérdida de Peso - Fase 1", 
    type: "Déficit calórico", 
    calories: "1800 kcal/día", 
    startDate: "15/04/2025", 
    endDate: "15/05/2025",
    status: "Activa"
  },
  {
    id: 2, 
    name: "Dieta de Volumen", 
    type: "Superávit calórico", 
    calories: "2500 kcal/día", 
    startDate: "10/01/2025", 
    endDate: "10/02/2025",
    status: "Completada"
  }
];

const workoutDetails = {
  id: 1,
  name: "Rutina de Fuerza - Fase 1",
  objective: "Aumento de fuerza general",
  startDate: "15/04/2025",
  endDate: "15/05/2025",
  trainerNotes: "Enfócate en la técnica correcta antes de aumentar peso",
  days: [
    {
      day: "Lunes",
      focus: "Pecho y Tríceps",
      exercises: [
        { name: "Press de banca", sets: 4, reps: "8-10", rest: "90s", notes: "Aumentar peso gradualmente" },
        { name: "Press inclinado con mancuernas", sets: 3, reps: "10-12", rest: "60s" },
        { name: "Fondos en paralelas", sets: 3, reps: "10-12", rest: "60s" },
        { name: "Extensiones de tríceps en polea", sets: 3, reps: "12-15", rest: "45s" }
      ]
    },
    {
      day: "Miércoles",
      focus: "Espalda y Bíceps",
      exercises: [
        { name: "Dominadas", sets: 4, reps: "6-8", rest: "90s", notes: "Usar asistencia si es necesario" },
        { name: "Remo con barra", sets: 3, reps: "8-10", rest: "60s" },
        { name: "Curl de bíceps con barra", sets: 3, reps: "10-12", rest: "60s" },
        { name: "Curl martillo", sets: 3, reps: "12-15", rest: "45s" }
      ]
    },
    {
      day: "Viernes",
      focus: "Piernas y Hombros",
      exercises: [
        { name: "Sentadillas", sets: 4, reps: "8-10", rest: "120s", notes: "Mantener espalda recta" },
        { name: "Peso muerto", sets: 3, reps: "8-10", rest: "120s" },
        { name: "Press militar", sets: 3, reps: "8-10", rest: "60s" },
        { name: "Elevaciones laterales", sets: 3, reps: "12-15", rest: "45s" }
      ]
    }
  ]
};

const dietDetails = {
  id: 1,
  name: "Plan Pérdida de Peso - Fase 1",
  objective: "Reducción de grasa corporal manteniendo masa muscular",
  calories: "1800 kcal/día",
  protein: "150g (33%)",
  carbs: "150g (33%)",
  fat: "60g (33%)",
  meals: [
    {
      name: "Desayuno",
      time: "7:00 AM",
      foods: [
        { name: "Claras de huevo", quantity: "4 unidades", calories: 70 },
        { name: "Avena", quantity: "40g", calories: 150 },
        { name: "Frutos rojos", quantity: "100g", calories: 50 },
        { name: "Café negro sin azúcar", quantity: "1 taza", calories: 0 }
      ]
    },
    {
      name: "Media mañana",
      time: "10:30 AM",
      foods: [
        { name: "Yogur griego", quantity: "150g", calories: 100 },
        { name: "Nueces", quantity: "15g", calories: 100 }
      ]
    },
    {
      name: "Almuerzo",
      time: "1:30 PM",
      foods: [
        { name: "Pechuga de pollo", quantity: "150g", calories: 250 },
        { name: "Arroz integral", quantity: "50g", calories: 170 },
        { name: "Verduras al vapor", quantity: "200g", calories: 70 }
      ]
    },
    {
      name: "Merienda",
      time: "4:30 PM",
      foods: [
        { name: "Batido de proteínas", quantity: "1 scoop", calories: 120 },
        { name: "Plátano", quantity: "1 unidad mediana", calories: 90 }
      ]
    },
    {
      name: "Cena",
      time: "8:00 PM",
      foods: [
        { name: "Salmón", quantity: "130g", calories: 230 },
        { name: "Ensalada mixta", quantity: "200g", calories: 60 },
        { name: "Aceite de oliva", quantity: "1 cucharada", calories: 120 }
      ]
    }
  ],
  trainerNotes: "Beber al menos 2 litros de agua al día. Puedes sustituir cualquier proteína por cantidad equivalente de otra fuente (tofu, tempeh, etc.)."
};

const ClientPortal = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mi Portal</h1>
        </div>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="workouts" className="py-3">
              <Dumbbell className="mr-2 h-5 w-5" />
              Mis Rutinas
            </TabsTrigger>
            <TabsTrigger value="diets" className="py-3">
              <Salad className="mr-2 h-5 w-5" />
              Mis Dietas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rutinas Asignadas</CardTitle>
                <CardDescription>
                  Aquí puedes ver todas las rutinas que tu entrenador te ha asignado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWorkouts.map((workout) => (
                      <TableRow key={workout.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{workout.name}</TableCell>
                        <TableCell>{workout.type}</TableCell>
                        <TableCell>{workout.frequency}</TableCell>
                        <TableCell>{workout.startDate}</TableCell>
                        <TableCell>{workout.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={workout.status === "Activa" ? "default" : "secondary"}>
                            {workout.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{workoutDetails.name}</CardTitle>
                    <CardDescription>{workoutDetails.objective}</CardDescription>
                  </div>
                  <Badge className="ml-2">{workoutDetails.startDate} - {workoutDetails.endDate}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {workoutDetails.trainerNotes && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 dark:bg-amber-900/30 dark:border-amber-400/50">
                    <div className="flex">
                      <Info className="h-5 w-5 text-amber-500 mr-2" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        <strong>Nota del entrenador:</strong> {workoutDetails.trainerNotes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutDetails.days.map((day, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-fitBlue-50 dark:bg-fitBlue-900/30 px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-md font-semibold">{day.day}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{day.focus}</p>
                          </div>
                          <Dumbbell className="h-5 w-5 text-fitBlue-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {day.exercises.map((exercise, exIndex) => (
                            <div key={exIndex} className="px-4 py-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{exercise.name}</p>
                                  <div className="flex space-x-4 mt-1">
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Activity className="h-3 w-3 mr-1" />
                                      {exercise.sets} series
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Activity className="h-3 w-3 mr-1" />
                                      {exercise.reps} reps
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {exercise.rest} descanso
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {exercise.notes && (
                                <p className="text-xs italic text-gray-500 mt-2">{exercise.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dietas Asignadas</CardTitle>
                <CardDescription>
                  Aquí puedes ver todos los planes dietéticos que tu entrenador te ha asignado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Calorías</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDiets.map((diet) => (
                      <TableRow key={diet.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{diet.name}</TableCell>
                        <TableCell>{diet.type}</TableCell>
                        <TableCell>{diet.calories}</TableCell>
                        <TableCell>{diet.startDate}</TableCell>
                        <TableCell>{diet.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={diet.status === "Activa" ? "default" : "secondary"}>
                            {diet.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{dietDetails.name}</CardTitle>
                    <CardDescription>{dietDetails.objective}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {dietDetails.calories}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-fitBlue-50 dark:bg-fitBlue-900/30 rounded-md p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Proteínas</p>
                    <p className="font-bold text-lg">{dietDetails.protein}</p>
                  </div>
                  <div className="bg-fitBlue-50 dark:bg-fitBlue-900/30 rounded-md p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Carbohidratos</p>
                    <p className="font-bold text-lg">{dietDetails.carbs}</p>
                  </div>
                  <div className="bg-fitBlue-50 dark:bg-fitBlue-900/30 rounded-md p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Grasas</p>
                    <p className="font-bold text-lg">{dietDetails.fat}</p>
                  </div>
                </div>

                {dietDetails.trainerNotes && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 dark:bg-amber-900/30 dark:border-amber-400/50">
                    <div className="flex">
                      <Info className="h-5 w-5 text-amber-500 mr-2" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        <strong>Nota del entrenador:</strong> {dietDetails.trainerNotes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {dietDetails.meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader className="bg-fitBlue-50 dark:bg-fitBlue-900/30 px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-md font-semibold">{meal.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{meal.time}</p>
                          </div>
                          <Salad className="h-5 w-5 text-fitBlue-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} className="px-4 py-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm">{food.name}</p>
                                <p className="text-xs text-gray-500">{food.quantity}</p>
                              </div>
                              <div className="text-sm font-medium">{food.calories} kcal</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientPortal;
