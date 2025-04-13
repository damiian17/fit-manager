
import { GeneratedDiet } from "@/types/diet";

// Example generated diet data
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
