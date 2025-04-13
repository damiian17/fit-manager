import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { DietFormData, WebhookResponse } from "@/types/diet";

const foodOptions = [
  "Aceite de oliva",
  "Carne roja",
  "Carne blanca",
  "Pescado blanco",
  "Pescado azul",
  "Procesados veganos",
  "Pan",
  "Mermelada",
  "Bebida vegetal",
  "Cereales",
  "Lácteos",
  "Aguacate",
  "Conservas de pescado",
  "Huevo",
  "Miel",
  "Legumbre",
  "Frutos secos",
  "Mantequilla",
  "Boniato",
  "Encuertidos",
  "Patata",
  "Fiambres"
];

interface DietFormProps {
  onDietGenerated: (response: WebhookResponse) => void;
}

export const DietForm = ({ onDietGenerated }: DietFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<DietFormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Send data to webhook
      const response = await fetch("https://primary-production-d78e.up.railway.app/webhook-test/23e2526a-6cb2-439e-a5ae-cd9e3db98365", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get webhook response data
      const mockWebhookResponse = await getMockWebhookResponse();
      
      // Pass the response to the parent component
      onDietGenerated(mockWebhookResponse);
      toast.success("Plan dietético generado correctamente");
    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast.error("Error al generar el plan dietético");
    } finally {
      setIsGenerating(false);
    }
  };

  // This function simulates the webhook response
  // In a real application, you would get this data from the webhook response
  const getMockWebhookResponse = async (): Promise<WebhookResponse> => {
    // For now, we'll return a mocked response that matches the structure
    // of the webhook response
    return [
      {
        "opcion": "Opcion1",
        "caloriasObjetivo": {
          "Comida1": 391,
          "Comida2": 406,
          "Comida3": 738,
          "Comida4": 469,
          "Comida5": 699
        },
        "recetasSeleccionadas": {
          "Comida1": {
            "nombre": "Queso fresco batido desnatadado con avena y fruta",
            "ingredientes": "• 200 ml de queso fresco batido desnatado\n• 50 g de avena\n• 1 plátano de 100 g aprox.",
            "kcals": 384,
            "gruposAlimentos": "Cereales, Lácteos",
            "tipo": "Comida 1",
            "macros": {
              "proteinas": 0,
              "grasas": 0,
              "carbohidratos": 0
            }
          },
          "Comida2": {
            "nombre": "Bocadillo de queso fresco con tomate y aceite",
            "ingredientes": "• 125 g de pan integral\n• 60 g de queso fresco de burgos desnatado (una tarrina pequeña aprox)\n• 5 g de aceite de oliva\n• Tomate al gusto",
            "kcals": 407,
            "gruposAlimentos": "Aceite de oliva, Lácteos, Pan",
            "tipo": "Comida 2",
            "macros": {
              "proteinas": 0,
              "grasas": 0,
              "carbohidratos": 0
            }
          },
          "Comida3": {
            "nombre": "Hélices de pasta con soja texturizada y tomate",
            "ingredientes": "• 100 g de pasta\n• 50 g de soja texturizada\n• 100 g de tomate frito\n• 15 ml de aceite de oliva\n• Verduras al gusto",
            "kcals": 730,
            "gruposAlimentos": "Aceite de oliva, Cereales, Procesados veganos",
            "tipo": "Comida 3",
            "macros": {
              "proteinas": 0,
              "grasas": 0,
              "carbohidratos": 0
            }
          },
          "Comida4": {
            "nombre": "Tosta de guacamole y pollo",
            "ingredientes": "• 100 g de pan\n• 100 g de guacamole\n• 100 g de pechuga de pollo\n• Verduras al gusto",
            "kcals": 492,
            "gruposAlimentos": "Aguacate, Carne blanca, Pan",
            "tipo": "Comida 4",
            "macros": {
              "proteinas": 0,
              "grasas": 0,
              "carbohidratos": 0
            }
          },
          "Comida5": {
            "nombre": "Ensalada de patata y atún",
            "ingredientes": "• 600 g de patata\n• Dos latas de atún al natural\n• 15 ml de aceite de oliva\n• Verduras al gusto",
            "kcals": 693,
            "gruposAlimentos": "Aceite de oliva, Conservas de pescado, Patata",
            "tipo": "Comida 5",
            "macros": {
              "proteinas": 0,
              "grasas": 0,
              "carbohidratos": 0
            }
          }
        },
        "caloriasTotalesDia": 2706,
        "caloriasDiariasObjetivo": 2877,
        "variacionCalorica": "94%"
      },
      {
        "tipo": "Resumen",
        "recetasUsadasTotal": 35,
        "recetasDisponiblesTotal": 226,
        "ingestasConfiguradas": [
          "Comida1",
          "Comida2",
          "Comida3",
          "Comida4",
          "Comida5"
        ],
        "prohibidos": [],
        "tiposComidaConfig": [
          "Comida 1",
          "Comida 2",
          "Comida 3",
          "Comida 4",
          "Comida 5"
        ],
        "tiposComidaDisponibles": [
          "Comida 3",
          "Comida 5",
          "Comida 4",
          "Comida 2",
          "Comida 1"
        ],
        "distribucionCalorias": {
          "Comida1": 432,
          "Comida2": 432,
          "Comida3": 800,
          "Comida4": 432,
          "Comida5": 700
        },
        "caloriasTotalesDiarias": 2877,
        "histogramaKcals": {
          "300": 5,
          "400": 16,
          "500": 2,
          "600": 5,
          "700": 4,
          "800": 3
        },
        "rangosOptimos": {
          "Comida 1": {
            "min": 200,
            "mediana": 450,
            "max": 900,
            "rangoFrecuente": 300,
            "total": 44
          },
          "Comida 2": {
            "min": 200,
            "mediana": 450,
            "max": 700,
            "rangoFrecuente": 400,
            "total": 22
          },
          "Comida 3": {
            "min": 100,
            "mediana": 550,
            "max": 1100,
            "rangoFrecuente": 500,
            "total": 94
          },
          "Comida 4": {
            "min": 200,
            "mediana": 350,
            "max": 500,
            "rangoFrecuente": 300,
            "total": 13
          },
          "Comida 5": {
            "min": 100,
            "mediana": 450,
            "max": 800,
            "rangoFrecuente": 400,
            "total": 53
          }
        }
      }
    ];
  };

  return (
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
            <Select 
              onValueChange={(value) => toggleAllergy(value)}
              value=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona alimentos prohibidos" />
              </SelectTrigger>
              <SelectContent>
                {foodOptions.map((food) => (
                  <SelectItem key={food} value={food}>{food}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Lista de alimentos seleccionados */}
            {formData.allergies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.allergies.map((allergy) => (
                  <div 
                    key={allergy} 
                    className="bg-fitGreen-100 text-fitGreen-800 text-xs font-medium px-2 py-1 rounded-md flex items-center"
                  >
                    {allergy}
                    <button 
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className="ml-1 text-fitGreen-600 hover:text-fitGreen-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
  );
};
