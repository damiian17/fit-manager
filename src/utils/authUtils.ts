
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica si hay una sesión activa
 * @returns La sesión activa o null si no hay sesión
 */
export const getActiveSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Obtiene datos del usuario actual
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Verifica si un usuario tiene perfil de cliente
 * @param userId ID del usuario
 * @returns True si tiene perfil, false si no
 */
export const hasClientProfile = async (userId: string) => {
  try {
    console.log("Verificando perfil para el usuario ID:", userId);
    
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error verificando perfil de cliente:", error);
      return false;
    }
    
    console.log("Resultado de verificación de perfil:", data);
    return !!data;
  } catch (error) {
    console.error("Error inesperado verificando perfil de cliente:", error);
    return false;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const signOut = async () => {
  localStorage.removeItem('clientLoggedIn');
  localStorage.removeItem('clientEmail');
  await supabase.auth.signOut();
};

/**
 * Inicia sesión con Google
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/client-register',
    }
  });
  
  if (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
  
  return data;
};

/**
 * Inicia sesión con email y contraseña
 */
export const signInWithPassword = async (email: string, password: string) => {
  console.log("Iniciando sesión con email:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Error al iniciar sesión con email y contraseña:", error);
    throw error;
  }
  
  console.log("Inicio de sesión exitoso:", data);
  
  // Guardar información en localStorage
  if (data.user) {
    localStorage.setItem('clientLoggedIn', 'true');
    localStorage.setItem('clientEmail', email);
  }
  
  return data;
};

/**
 * Registra un nuevo usuario con email y contraseña
 */
export const signUpWithPassword = async (email: string, password: string) => {
  console.log("Registrando nuevo usuario con email:", email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + '/client-register',
    }
  });
  
  if (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
  
  console.log("Registro exitoso:", data);
  
  // Guardar información en localStorage
  if (data.user) {
    localStorage.setItem('clientLoggedIn', 'true');
    localStorage.setItem('clientEmail', email);
  }
  
  return data;
};

/**
 * Busca un usuario por email en la tabla de clientes
 * @param email Email del usuario
 * @returns ID del usuario si existe, undefined si no
 */
export const findUserIdByEmail = async (email: string) => {
  try {
    if (!email) return undefined;
    
    console.log("Buscando usuario por email:", email);
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error("Error buscando usuario por email:", error);
      return undefined;
    }
    
    return data?.id;
  } catch (error) {
    console.error("Error inesperado buscando usuario:", error);
    return undefined;
  }
};

/**
 * Crea o actualiza el perfil de un cliente 
 * @param clientData Datos del cliente a guardar
 * @param userId ID del usuario (opcional, si no se proporciona se usará el usuario actual)
 */
export const saveClientProfile = async (clientData: any, userId?: string) => {
  try {
    // Si no se proporciona userId, intentar obtenerlo de la sesión actual
    if (!userId) {
      const user = await getCurrentUser();
      userId = user?.id;
      
      if (!userId) {
        throw new Error("No se pudo determinar el ID del usuario");
      }
    }
    
    console.log("Guardando perfil para usuario ID:", userId, "con datos:", clientData);
    
    // Preparar datos para guardar
    const profileData = {
      id: userId,
      ...clientData
    };
    
    // Upsert para crear o actualizar el perfil
    const { data, error } = await supabase
      .from('clients')
      .upsert(profileData)
      .select();
    
    if (error) {
      console.error("Error guardando perfil del cliente:", error);
      throw error;
    }
    
    console.log("Perfil guardado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error inesperado guardando perfil:", error);
    throw error;
  }
};
