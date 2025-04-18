
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
  output: {
    [key: string]: DayWorkout[];
  };
}
