// Type definitions
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  height?: string;
  weight?: string;
  fitnessLevel?: string;
  goals?: string;
  medicalHistory?: string;
  status: string;
  age?: number;
  sex?: string;
  diets: Diet[];
  workouts: Workout[];
}

export interface Diet {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  // Other diet properties
}

export interface Workout {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  workoutData?: any; // Full workout data
  // Other workout properties
}

import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

// Client functions
export const getClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    
    // Transform Supabase response to Client interface
    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      birthdate: client.birthdate,
      height: client.height,
      weight: client.weight,
      fitnessLevel: client.fitness_level,
      goals: client.goals,
      medicalHistory: client.medical_history,
      status: client.status || "active",
      age: client.age,
      sex: client.sex,
      diets: [],
      workouts: []
    }));
  } catch (error) {
    console.error("Unexpected error fetching clients:", error);
    return [];
  }
};

export const saveClient = async (client: Omit<Client, 'id' | 'diets' | 'workouts'>) => {
  try {
    // Save to Supabase
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        birthdate: client.birthdate,
        height: client.height,
        weight: client.weight,
        fitness_level: client.fitnessLevel,
        goals: client.goals,
        medical_history: client.medicalHistory,
        status: client.status,
        age: client.age,
        sex: client.sex
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving client to Supabase:", error);
      throw error;
    }

    return {
      ...client,
      id: data.id,
      diets: [],
      workouts: []
    };
  } catch (error) {
    console.error("Unexpected error saving client:", error);
    throw error;
  }
};

export const updateClient = async (updatedClient: Client) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: updatedClient.name,
        email: updatedClient.email,
        phone: updatedClient.phone,
        birthdate: updatedClient.birthdate,
        height: updatedClient.height,
        weight: updatedClient.weight,
        fitness_level: updatedClient.fitnessLevel,
        goals: updatedClient.goals,
        medical_history: updatedClient.medicalHistory,
        status: updatedClient.status,
        age: updatedClient.age,
        sex: updatedClient.sex
      })
      .eq('id', updatedClient.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client in Supabase:", error);
      throw error;
    }
    
    return {
      ...updatedClient,
      id: data.id
    };
  } catch (error) {
    console.error("Unexpected error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) {
      console.error("Error deleting client from Supabase:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting client:", error);
    throw error;
  }
};

export const getClientById = async (clientId: string): Promise<Client | undefined> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error fetching client by ID:", error);
      return undefined;
    }
    
    // Transform Supabase response to Client interface
    return {
      id: data.id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      birthdate: data.birthdate,
      height: data.height,
      weight: data.weight,
      fitnessLevel: data.fitness_level,
      goals: data.goals,
      medicalHistory: data.medical_history,
      status: data.status || "active",
      age: data.age,
      sex: data.sex,
      diets: [],
      workouts: []
    };
  } catch (error) {
    console.error("Unexpected error fetching client by ID:", error);
    return undefined;
  }
};

// Diet functions
export const getDiets = async (): Promise<Diet[]> => {
  try {
    const { data, error } = await supabase
      .from('diets')
      .select('*');
    
    if (error) {
      console.error("Error fetching diets:", error);
      return [];
    }
    
    // Transform Supabase response to Diet interface
    return data.map(diet => ({
      id: diet.id,
      name: diet.name,
      clientId: diet.client_id || "",
      clientName: diet.client_name,
      createdAt: diet.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Unexpected error fetching diets:", error);
    return [];
  }
};

export const saveDiet = async (diet: Omit<Diet, 'id' | 'createdAt'>) => {
  try {
    // Save diet to Supabase
    const { data, error } = await supabase
      .from('diets')
      .insert({
        name: diet.name,
        client_id: diet.clientId,
        client_name: diet.clientName,
        diet_data: {} as Json,
        form_data: {} as Json
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving diet to Supabase:", error);
      throw error;
    }
    
    return {
      ...diet,
      id: data.id,
      createdAt: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Unexpected error saving diet:", error);
    throw error;
  }
};

// Workout functions
export const getWorkouts = async () => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching workouts:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getWorkouts:", error);
    return [];
  }
};

export const saveWorkout = async (workout: Omit<Workout, 'id' | 'createdAt'> & { workout_data: any, form_data: any }) => {
  try {
    console.log("Saving workout data to Supabase:", workout);
    
    // Ensure workout_data is properly structured
    const workoutDataToSave = workout.workout_data ? workout.workout_data : { 
      output: {} 
    };
    
    // Save workout to Supabase
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        name: workout.name,
        client_id: workout.clientId,
        client_name: workout.clientName,
        workout_data: workoutDataToSave as Json,
        form_data: workout.form_data as Json
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving workout to Supabase:", error);
      throw error;
    }
    
    console.log("Workout saved successfully:", data);
    
    return {
      ...workout,
      id: data.id,
      createdAt: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Unexpected error saving workout:", error);
    throw error;
  }
};

export const getWorkoutById = async (workoutId: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();
    
    if (error) {
      console.error("Error fetching workout by ID:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error fetching workout by ID:", error);
    return null;
  }
};

export const updateWorkout = async (workout: any) => {
  try {
    console.log("Updating workout in Supabase:", workout);
    
    const { data, error } = await supabase
      .from('workouts')
      .update({
        name: workout.name,
        workout_data: workout.workout_data as Json,
        form_data: workout.form_data as Json
      })
      .eq('id', workout.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating workout in Supabase:", error);
      throw error;
    }
    
    console.log("Workout updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error updating workout:", error);
    throw error;
  }
};

// Stats functions
export const getStats = async () => {
  try {
    // Get client count
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id');
    
    // Get workout count
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('id');
    
    // Get diet count
    const { data: diets, error: dietsError } = await supabase
      .from('diets')
      .select('id');
    
    if (clientsError || workoutsError || dietsError) {
      console.error("Error fetching stats:", { clientsError, workoutsError, dietsError });
      return {
        totalClients: 0,
        activeWorkouts: 0,
        activeDiets: 0,
        completedSessions: 0
      };
    }
    
    return {
      totalClients: clients.length,
      activeWorkouts: workouts.length,
      activeDiets: diets.length,
      completedSessions: 0 // This would be implemented with actual session tracking
    };
  } catch (error) {
    console.error("Unexpected error fetching stats:", error);
    return {
      totalClients: 0,
      activeWorkouts: 0,
      activeDiets: 0,
      completedSessions: 0
    };
  }
};
