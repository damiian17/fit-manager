
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

// Webhook response types
export type WebhookResponse = Array<DietOption | SummaryItem>;

export interface DietOption {
  opcion: string;
  caloriasObjetivo: {
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
}

export interface SummaryItem {
  tipo: string;
  recetasUsadasTotal: number;
  recetasDisponiblesTotal: number;
  ingestasConfiguradas: string[];
  prohibidos: string[];
  tiposComidaConfig: string[];
  tiposComidaDisponibles: string[];
  distribucionCalorias: {
    [key: string]: number;
  };
  caloriasTotalesDiarias: number;
  histogramaKcals: {
    [key: string]: number;
  };
  rangosOptimos: {
    [key: string]: {
      min: number;
      mediana: number;
      max: number;
      rangoFrecuente: number;
      total: number;
    };
  };
}

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
