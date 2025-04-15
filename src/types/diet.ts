// Diet form data type
export interface DietFormData {
  clientId: string;
  clientName?: string;
  dietName: string;
  age: string;
  weight: string;
  height: string;
  sex: string;
  meals: string;
  activityLevel: string;
  allergies: string[];
  goal: string;
  dietType: string;
}

// New webhook response type for the updated format
export type WebhookResponse = DailyMeal[];

export interface DailyMeal {
  dia: string;
  comida1: MealItem;
  comida2: MealItem;
  comida3: MealItem;
  comida4?: MealItem;
  kcalTotales: number;
  kcalObjetivo: number;
  variacion: string;
}

export interface MealItem {
  nombre: string;
  ingredientes: string;
  kcals: number;
  grupos: string;
}

// Keep the old types for backwards compatibility
export interface DietOption {
  opcion: string;
  caloriasObjetivo?: {
    [key: string]: number;
  };
  recetasSeleccionadas: {
    [key: string]: {
      nombre: string;
      ingredientes: string;
      kcals: number;
      gruposAlimentos: string;
      tipo: string;
      macros: {
        proteinas: number;
        grasas: number;
        carbohidratos: number;
      };
    };
  };
  caloriasTotalesDia: number;
  caloriasDiariasObjetivo: number;
  variacionCalorica: string;
  clientId?: number;
  clientName?: string;
  dietName?: string;
}

export interface SummaryItem {
  tipo: string;
  recetasUsadasTotal: number;
  recetasDisponiblesTotal: number;
  ingestasConfiguradas: string[];
  prohibidos: string[];
  tiposComidaConfig: string[];
  tiposComidaDisponibles: string[];
  distribucionCaloriasBase?: {
    [key: string]: number;
  };
  caloriasTotalesDiariasObjetivo: number;
  histogramaKcalsSeleccionadas?: {
    [key: string]: number;
  };
  rangosOptimosDetectados?: {
    [key: string]: {
      min: number;
      mediana: number;
      max: number;
      rangoFrecuente: number;
      total: number;
    };
  };
}

// Alias for SummaryItem to make the code more readable
export type DietSummary = SummaryItem;

// Generated diet data structure
export interface GeneratedDiet {
  days: DietDay[];
  totalMacros: Macros;
}

export interface DietDay {
  name: string;
  meals: Meal[];
}

export interface Meal {
  name: string;
  foods: string[];
  macros: Macros;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
