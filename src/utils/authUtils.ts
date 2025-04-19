// src/utils/authUtils.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Obtener la sesión activa
export const getActiveSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  return data.session;
};

// Iniciar sesión con email y contraseña
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Registrar nuevo usuario
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Marca que necesita completar el registro
      data: {
        needsToCompleteRegistration: true
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Iniciar sesión con Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // Marca que necesita completar el registro si es la primera vez
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Cerrar sesión
export const signOut = async (navigate: Function) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Redirigir al login
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Error al cerrar sesión");
    throw error;
  }
};

// Verificar si un usuario debe completar su registro
export const checkNeedsToCompleteRegistration = async (userId: string) => {
  // Verificar si el usuario ya existe en la tabla de clientes
  const { data, error } = await supabase
    .from('clients')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) {
    console.error("Error checking client:", error);
    return true; // En caso de error, asumimos que necesita completar el registro
  }
  
  // Si no hay datos, el usuario no ha completado su registro
  return !data;
};

// Actualizar el flag de registro completado
export const updateRegistrationStatus = async (userId: string) => {
  const { error } = await supabase.auth.updateUser({
    data: { needsToCompleteRegistration: false }
  });
  
  if (error) {
    console.error("Error updating user metadata:", error);
    return false;
  }
  
  return true;
};
