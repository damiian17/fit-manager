import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  height?: string;
  weight?: string;
  age?: number;
  sex?: string;
  fitness_level?: string;
  goals?: string;
  medical_history?: string;
  status: string;
}

export interface Diet {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  diet_data: any;
  form_data: any;
  created_at: string;
}

export interface Workout {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  workout_data: any;
  form_data: any;
  created_at: string;
}

// Client operations
export const getClientByEmail = async (email: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error("Error fetching client by email:", error);
    return null;
  }
  
  return data;
};

// Diet operations
export const getClientDiets = async (clientId: string): Promise<Diet[]> => {
  const { data, error } = await supabase
    .from('diets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching client diets:", error);
    return [];
  }
  
  return data || [];
};

export const getDietById = async (dietId: string): Promise<Diet | null> => {
  const { data, error } = await supabase
    .from('diets')
    .select('*')
    .eq('id', dietId)
    .single();
    
  if (error) {
    console.error("Error fetching diet by ID:", error);
    return null;
  }
  
  return data;
};

// Workout operations
export const getClientWorkouts = async (clientId: string): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching client workouts:", error);
    return [];
  }
  
  return data || [];
};

// Diet saving operation
export const saveDiet = async (dietData: Omit<Diet, 'id' | 'created_at'>): Promise<Diet | null> => {
  const { data, error } = await supabase
    .from('diets')
    .insert(dietData)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving diet:", error);
    return null;
  }
  
  return data;
};

// Workout saving operation
export const saveWorkout = async (workoutData: Omit<Workout, 'id' | 'created_at'>): Promise<Workout | null> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workoutData)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving workout:", error);
    return null;
  }
  
  return data;
};
