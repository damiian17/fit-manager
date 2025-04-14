// Type definitions
interface Client {
  id: number | string;
  name: string;
  email: string;
  phone: string;
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

interface Diet {
  id: number | string;
  name: string;
  clientId: number | string;
  clientName: string;
  createdAt: string;
  // Other diet properties
}

interface Workout {
  id: number | string;
  name: string;
  clientId: number | string;
  clientName: string;
  createdAt: string;
  // Other workout properties
}

import { supabase } from "@/integrations/supabase/client";

// Storage keys
const CLIENTS_STORAGE_KEY = 'fit-manager-clients';
const DIETS_STORAGE_KEY = 'fit-manager-diets';
const WORKOUTS_STORAGE_KEY = 'fit-manager-workouts';

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

export const saveClient = async (client: Client) => {
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
      id: data.id
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

export const deleteClient = async (clientId: number | string) => {
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

export const getClientById = async (clientId: number | string): Promise<Client | undefined> => {
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
      clientId: diet.client_id,
      clientName: diet.client_name,
      createdAt: diet.created_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching diets:", error);
    return [];
  }
};

export const saveDiet = async (diet: Diet) => {
  try {
    // Save diet to Supabase
    const { data, error } = await supabase
      .from('diets')
      .insert({
        name: diet.name,
        client_id: diet.clientId,
        client_name: diet.clientName,
        diet_data: {},
        form_data: {}
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving diet to Supabase:", error);
      throw error;
    }
    
    return {
      ...diet,
      id: data.id
    };
  } catch (error) {
    console.error("Unexpected error saving diet:", error);
    throw error;
  }
};

// Workout functions
export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*');
    
    if (error) {
      console.error("Error fetching workouts:", error);
      return [];
    }
    
    // Transform Supabase response to Workout interface
    return data.map(workout => ({
      id: workout.id,
      name: workout.name,
      clientId: workout.client_id,
      clientName: workout.client_name,
      createdAt: workout.created_at,
    }));
  } catch (error) {
    console.error("Unexpected error fetching workouts:", error);
    return [];
  }
};

export const saveWorkout = async (workout: Workout) => {
  try {
    // Save workout to Supabase
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        name: workout.name,
        client_id: workout.clientId,
        client_name: workout.clientName,
        workout_data: {},
        form_data: {}
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving workout to Supabase:", error);
      throw error;
    }
    
    return {
      ...workout,
      id: data.id
    };
  } catch (error) {
    console.error("Unexpected error saving workout:", error);
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
