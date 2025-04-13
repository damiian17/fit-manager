
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChevronLeft, Sparkles, FileDown, Mail, Salad, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const DietGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietGenerated, setDietGenerated] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    meals: "3",
    activityLevel: "",
    allergies: [] as string[],
    goal: "",
    dietType: "",
  });

  // Sample allergies/forbidden foods
  const allergiesOptions = [
    "Gluten", "Lácteos", "Frutos secos", "Mariscos", "Huevo", 
    "Soja", "Pescado", "Maní", "Azúcar refinada"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => {
      const newAllergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies: newAllergies };
    });
  };

  const handleGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.age || !formData.weight || !formData.height || !formData.sex || !formData.activityLevel || !formData.goal || !formData.dietType) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDietGenerated(true);
      toast.success("Plan dietético generado correctamente");
    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast.error("Error al generar el plan dietético");
    } finally {
      setIsGenerating(false);
    }
  };

  // Example generated diet data
  const generatedDiet = {
    days: [
      {
        name: "Día 1",
        meals: [
          { 
            name: "Desayuno", 
            foods: [
              "2 huevos revueltos",
              "1 rebanada de pan integral",
              "1/2 aguacate",
              "1 taza de café negro o té verde"
            ],
            macros: { calories: 450, protein: 25, carbs: 30, fat: 25 }
          },
          { 
            name: "Almuerzo", 
            foods: [
              "150g de pechuga de pollo a la plancha",
              "1 taza de arroz integral",
              "Ensalada de verduras mixtas con aceite de oliva",
              "1 manzana"
            ],
            macros: { calories: 650, protein: 40, carbs: 70, fat: 15 }
          },
          { 
            name: "Cena", 
            foods: [
              "150g de salmón al horno",
              "200g de batata asada",
              "Brócoli al vapor",
              "1 cucharada de aceite de oliva"
            ],
            macros: { calories: 550, protein: 35, carbs: 45, fat: 25 }
          },
        ]
      },
      {
        name: "Día 2",
        meals: [
          { 
            name: "Desayuno", 
            foods: [
              "Batido de proteínas (1 scoop)",
              "1 plátano",
              "200ml de leche de almendras",
              "1 cucharada de mantequilla de maní"
            ],
            macros: { calories: 400, protein: 30, carbs: 35, fat: 15 }
          },
          { 
            name: "Almuerzo", 
            foods: [
              "Ensalada de atún (120g)",
              "2 rebanadas de pan integral",
              "1 tomate",
              "1/2 cebolla",
              "1 cucharada de mayonesa light"
            ],
            macros: { calories: 550, protein: 35, carbs: 50, fat: 20 }
          },
          { 
            name: "Cena", 
            foods: [
              "150g de carne magra",
              "1 taza de quinoa",
              "Espárragos al horno",
              "1 yogur natural"
            ],
            macros: { calories: 600, protein: 45, carbs: 50, fat: 20 }
          },
        ]
      },
    ],
    totalMacros: { calories: 3200, protein: 210, carbs: 280, fat: 120 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/diets")} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Generador de Dietas</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!dietGenerated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Parámetros del Plan Dietético</CardTitle>
                  <CardDescription>
                    Completa la siguiente información para generar un plan dietético personalizado. Los campos marcados con * son obligatorios.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateDiet} className="space-y-6">
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
                        <Label htmlFor="sex">Sexo *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("sex", value)}
                          value={formData.sex}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Femenino</SelectItem>
                            <SelectItem value="otro">Otro? No, solo existen 2 generos, perroflautadas 0</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meals">Comidas diarias *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("meals", value)}
                          value={formData.meals}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 comidas</SelectItem>
                            <SelectItem value="3">3 comidas</SelectItem>
                            <SelectItem value="4">4 comidas</SelectItem>
                            <SelectItem value="5">5 comidas</SelectItem>
                            <SelectItem value="6">6 comidas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Nivel de actividad física *</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("activityLevel", value)}
                        value={formData.activityLevel}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentario (poco o nada de ejercicio)</SelectItem>
                          <SelectItem value="light">Ligero (ejercicio ligero 1-3 días/semana)</SelectItem>
                          <SelectItem value="moderate">Moderado (ejercicio moderado 3-5 días/semana)</SelectItem>
                          <SelectItem value="active">Intenso (ejercicio intenso 6-7 días/semana)</SelectItem>
                          <SelectItem value="very_active">Muy intenso (ejercicio intenso diario o físicamente exigente)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Alimentos prohibidos/alergias (opcional)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {allergiesOptions.map((allergy) => (
                          <div key={allergy} className="flex items-center space-x-2">
                            <Checkbox
                              id={`allergy-${allergy}`}
                              checked={formData.allergies.includes(allergy)}
                              onCheckedChange={() => toggleAllergy(allergy)}
                            />
                            <label
                              htmlFor={`allergy-${allergy}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {allergy}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="goal">Objetivo nutricional *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("goal", value)}
                          value={formData.goal}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un objetivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weight_loss">Pérdida de peso</SelectItem>
                            <SelectItem value="maintenance">Mantenimiento</SelectItem>
                            <SelectItem value="muscle_gain">Ganancia de masa muscular</SelectItem>
                            <SelectItem value="performance">Rendimiento deportivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dietType">Tipo de dieta *</Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange("dietType", value)}
                          value={formData.dietType}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bulk">Bulk</SelectItem>
                            <SelectItem value="Defi">Defi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-fitGreen-600 hover:bg-fitGreen-700" 
                      disabled={isGenerating}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando plan dietético...
                        </>
                      ) : (
                        "Generar Plan Dietético"
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
                      <CardTitle>Plan Dietético Personalizado</CardTitle>
                      <CardDescription>
                        Basado en los parámetros proporcionados
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
                    <div className="mb-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
                      <h3 className="font-semibold text-fitGreen-800 mb-2">Resumen Nutricional</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.calories}</div>
                          <div className="text-xs text-gray-500">Calorías</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.protein}g</div>
                          <div className="text-xs text-gray-500">Proteínas</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.carbs}g</div>
                          <div className="text-xs text-gray-500">Carbohidratos</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-fitGreen-600">{generatedDiet.totalMacros.fat}g</div>
                          <div className="text-xs text-gray-500">Grasas</div>
                        </div>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="day-0" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-4">
                        {generatedDiet.days.map((day, index) => (
                          <TabsTrigger key={index} value={`day-${index}`}>{day.name}</TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {generatedDiet.days.map((day, dayIndex) => (
                        <TabsContent key={dayIndex} value={`day-${dayIndex}`} className="space-y-6">
                          {day.meals.map((meal, mealIndex) => (
                            <Card key={mealIndex}>
                              <CardHeader className="pb-2">
                                <div className="flex items-center">
                                  <Salad className="h-5 w-5 text-fitGreen-600 mr-2" />
                                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                                </div>
                                <CardDescription className="flex space-x-4 text-xs mt-1">
                                  <span>Calorías: {meal.macros.calories}</span>
                                  <span>P: {meal.macros.protein}g</span>
                                  <span>C: {meal.macros.carbs}g</span>
                                  <span>G: {meal.macros.fat}g</span>
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc list-inside space-y-1">
                                  {meal.foods.map((food, foodIndex) => (
                                    <li key={foodIndex} className="text-sm">{food}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                    
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold mb-2">Recomendaciones generales</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>Mantén una buena hidratación. Se recomienda beber al menos 2 litros de agua al día.</li>
                        <li>Intenta establecer horarios regulares para tus comidas.</li>
                        <li>Mastica lentamente para mejorar la digestión y favorecer la sensación de saciedad.</li>
                        <li>Limita el consumo de alimentos procesados y bebidas azucaradas.</li>
                        <li>Si tienes cualquier duda o malestar, consulta con tu nutricionista.</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
                      <h3 className="font-semibold text-fitGreen-800 mb-2">Lista de compra</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Proteínas</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Pechuga de pollo (300g)</li>
                            <li>Salmón (300g)</li>
                            <li>Atún en conserva</li>
                            <li>Carne magra (300g)</li>
                            <li>Huevos (1 docena)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Carbohidratos</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Pan integral</li>
                            <li>Arroz integral</li>
                            <li>Quinoa</li>
                            <li>Batatas</li>
                            <li>Plátanos</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Frutas y Verduras</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Espinacas</li>
                            <li>Brócoli</li>
                            <li>Tomates</li>
                            <li>Aguacates</li>
                            <li>Manzanas</li>
                            <li>Espárragos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setDietGenerated(false)}>
                    Modificar parámetros
                  </Button>
                  <Button className="flex-1 bg-fitGreen-600 hover:bg-fitGreen-700">
                    Guardar plan dietético
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consejos Nutricionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Para pérdida de peso, crea un déficit calórico moderado de 300-500 calorías por día.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Para ganancia muscular, aumenta la ingesta de proteínas a 1.6-2.2g por kg de peso corporal.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Distribuye las proteínas a lo largo del día para maximizar la síntesis proteica muscular.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-fitGreen-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Prioriza alimentos enteros y no procesados para optimizar la salud y el rendimiento.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alimentos Recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="font-medium mb-1">Fuentes de Proteínas</h4>
                    <p className="text-xs text-gray-500">
                      Pechuga de pollo, claras de huevo, atún, lentejas, tofu, queso cottage
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="font-medium mb-1">Carbohidratos Complejos</h4>
                    <p className="text-xs text-gray-500">
                      Avena, arroz integral, quinoa, boniato, legumbres, frutas
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="font-medium mb-1">Grasas Saludables</h4>
                    <p className="text-xs text-gray-500">
                      Aguacate, aceite de oliva, frutos secos, semillas, salmón
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="font-medium mb-1">Verduras de Hoja Verde</h4>
                    <p className="text-xs text-gray-500">
                      Espinacas, kale, rúcula, acelgas, lechuga
                    </p>
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

export default DietGenerator;
