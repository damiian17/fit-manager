
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
