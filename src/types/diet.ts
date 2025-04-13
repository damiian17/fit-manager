
export interface DietFormData {
  clientId: string;
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

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  foods: string[];
  macros: Macros;
}

export interface Day {
  name: string;
  meals: Meal[];
}

export interface GeneratedDiet {
  days: Day[];
  totalMacros: Macros;
}

// New interfaces for webhook response
export interface Recipe {
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
}

export interface DietOption {
  opcion: string;
  caloriasObjetivo: Record<string, number>;
  recetasSeleccionadas: Record<string, Recipe>;
  caloriasTotalesDia: number;
  caloriasDiariasObjetivo: number;
  variacionCalorica: string;
}

export interface DietSummary {
  tipo: string;
  recetasUsadasTotal: number;
  recetasDisponiblesTotal: number;
  ingestasConfiguradas: string[];
  prohibidos: string[];
  tiposComidaConfig: string[];
  tiposComidaDisponibles: string[];
  distribucionCalorias: Record<string, number>;
  caloriasTotalesDiarias: number;
  histogramaKcals: Record<string, number>;
  rangosOptimos: Record<string, {
    min: number;
    mediana: number;
    max: number;
    rangoFrecuente: number;
    total: number;
  }>;
}

export type WebhookResponse = Array<DietOption | DietSummary>;
