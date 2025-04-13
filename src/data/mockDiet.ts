
import { GeneratedDiet, WebhookResponse } from "@/types/diet";

// Example generated diet data for the original format
export const generatedDietData: GeneratedDiet = {
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

// Example webhook response data
export const mockWebhookResponse: WebhookResponse = [
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
    "opcion": "Opcion2",
    "caloriasObjetivo": {
      "Comida1": 420,
      "Comida2": 394,
      "Comida3": 805,
      "Comida4": 464,
      "Comida5": 719
    },
    "recetasSeleccionadas": {
      "Comida1": {
        "nombre": "Tostadas con hummus",
        "ingredientes": "• 125 g de pan\n• 50 g de hummus\n• Verduras al gusto",
        "kcals": 421,
        "gruposAlimentos": "Legumbre, Pan",
        "tipo": "Comida 1",
        "macros": {
          "proteinas": 0,
          "grasas": 0,
          "carbohidratos": 0
        }
      },
      "Comida2": {
        "nombre": "Bocadillo de lomo",
        "ingredientes": "• 125 g de pan integral\n• 60 g de lomo embuchado\n• Tomate",
        "kcals": 397,
        "gruposAlimentos": "Fiambres, Pan",
        "tipo": "Comida 2",
        "macros": {
          "proteinas": 0,
          "grasas": 0,
          "carbohidratos": 0
        }
      },
      "Comida3": {
        "nombre": "Cuscús con garbanzos y patata",
        "ingredientes": "• 100 g de cuscús\n• 200 g de patata\n• 200 g de garbanzos ya cocidos\n• 25 g de uvas pasas\n• 10 ml de aceite de oliva\n• Verduras al gusto",
        "kcals": 907,
        "gruposAlimentos": "Aceite de oliva, Cereales, Legumbre, Patata",
        "tipo": "Comida 3",
        "macros": {
          "proteinas": 0,
          "grasas": 0,
          "carbohidratos": 0
        }
      },
      "Comida4": {
        "nombre": "Tosta de salmón ahumado y queso de untar",
        "ingredientes": "• 100 g de pan\n• 50 g de salmón ahumado\n• 30 g de queso de untar\n• Verduras al gusto",
        "kcals": 422,
        "gruposAlimentos": "Lácteos, Pan, Pescado azul",
        "tipo": "Comida 4",
        "macros": {
          "proteinas": 0,
          "grasas": 0,
          "carbohidratos": 0
        }
      },
      "Comida5": {
        "nombre": "Huevos rotos con jamón al horno",
        "ingredientes": "• 600 g de patatas\n• 1 huevo L\n• 60 g de jamón\n• 5 ml de aceite de oliva virgen extra\n• Verduras al gusto",
        "kcals": 665,
        "gruposAlimentos": "Aceite de oliva, Fiambres, Huevo, Patata",
        "tipo": "Comida 5",
        "macros": {
          "proteinas": 0,
          "grasas": 0,
          "carbohidratos": 0
        }
      }
    },
    "caloriasTotalesDia": 2812,
    "caloriasDiariasObjetivo": 2877,
    "variacionCalorica": "98%"
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
