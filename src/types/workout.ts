
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
  Dia: string;
  Ejercicios: ExerciseData[];
}

export interface WorkoutResponse {
  output: {
    Rutina_4_Dias?: DayWorkout[];
    RutinaSemanal?: DayWorkout[];
  };
}
