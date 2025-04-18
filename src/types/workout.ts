
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
  Día: string;
  Ejercicios: ExerciseData[];
}

export interface WorkoutResponse {
  output: {
    RutinaSemanal: DayWorkout[];
  };
}
