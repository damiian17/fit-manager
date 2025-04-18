
export interface ExerciseData {
  Ejercicio: string;
  SeriesPrevias: string;
  Descanso: string;
  Anotaciones: string;
  PrimeraSerie: string;
  SegundaSerie: string;
  TerceraSerie: string;
  RIR: string;
}

export interface DayWorkout {
  Dia?: string;
  Día?: string;
  Ejercicios: ExerciseData[];
}

export interface WorkoutResponse {
  output: DayWorkout[];
}

export interface SavedWorkout {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  workout_data: WorkoutResponse;
  form_data: any;
  created_at: string;
}
