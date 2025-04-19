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
  trainer_id?: string;
}

export interface Diet {
  id: string;
  name: string;
  client_id: string;
  client_name: string | null;
  created_at: string;
  diet_data: any;
  form_data: any;
  trainer_id?: string | null;
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

export interface NotificationData {
  id: string;
  client_id: string;
  client_name: string;
  trainer_id: string;
  message: string;
  type: string;
  item_id: string;
  item_name: string;
  status: string;
  created_at: string;
}

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

/**
 * Fetch diets by trainer ID properly, includes diets assigned to their clients.
 */
export const getTrainerDiets = async (trainerId: string | undefined): Promise<Diet[]> => {
  if (!trainerId) {
    console.error("Trainer ID is undefined");
    return [];
  }

  const { data, error } = await supabase
    .from('diets')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching trainer diets:", error);
    return [];
  }

  return data || [];
};

export const saveDiet = async (diet: any) => {
  try {
    console.log("Saving diet to Supabase:", diet);

    const { data, error } = await supabase
      .from('diets')
      .insert({
        name: diet.name,
        client_id: diet.client_id,
        client_name: diet.client_name,
        diet_data: diet.diet_data,
        form_data: diet.form_data,
        trainer_id: diet.trainer_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving diet to Supabase:", error);
      throw error;
    }

    console.log("Diet saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in saveDiet:", error);
    throw error;
  }
};

export const updateDiet = async (diet: any) => {
  try {
    console.log("Updating diet in Supabase:", diet);

    const { data, error } = await supabase
      .from('diets')
      .update({
        name: diet.name,
        diet_data: diet.diet_data,
        form_data: diet.form_data,
      })
      .eq('id', diet.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating diet in Supabase:", error);
      throw error;
    }

    console.log("Diet updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in updateDiet:", error);
    throw error;
  }
};

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

export const getTrainerNotifications = async (trainerId: string | undefined): Promise<NotificationData[]> => {
  if (!trainerId) {
    console.error("Trainer ID is undefined");
    return [];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching trainer notifications:", error);
    return [];
  }

  return data || [];
};

export const getTrainerInviteCode = async (trainerId: string): Promise<string | null> => {
  if (!trainerId) {
    console.error("Trainer ID is undefined");
    return null;
  }

  const { data, error } = await supabase
    .from('trainer_invite_codes')
    .select('code')
    .eq('trainer_id', trainerId)
    .single();

  if (error) {
    console.error("Error fetching trainer invite code:", error);
    return null;
  }

  return data?.code || null;
};

export const updateTrainerInviteCode = async (trainerId: string, newCode: string) => {
  if (!trainerId) {
    throw new Error("Trainer ID is undefined");
  }

  try {
    const { data, error } = await supabase
      .from('trainer_invite_codes')
      .upsert({
        trainer_id: trainerId,
        code: newCode.toUpperCase(),
        is_used: false,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'trainer_id' })
      .select()
      .single();

    if (error) {
      console.error("Error updating trainer invite code:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateTrainerInviteCode:", error);
    throw error;
  }
};

export const createTrainerInviteCodeIfNotExists = async (trainerId: string): Promise<string | null> => {
  if (!trainerId) {
    console.error("Trainer ID is undefined");
    return null;
  }

  const existingCode = await getTrainerInviteCode(trainerId);
  if (existingCode) {
    return existingCode;
  }

  const { data, error } = await supabase.rpc('create_trainer_invite_code', {
    trainer_id: trainerId
  });

  if (error) {
    console.error("Error generating new trainer invite code:", error);
    return null;
  }

  return data;
};

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
