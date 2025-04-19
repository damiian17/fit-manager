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
    
    if (!userId) {
      console.error("No se proporcionó ID de usuario para verificar perfil");
      return false;
    }
    
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
 * Cierra la sesión del usuario y limpia TODOS los datos locales
 * @param navigate Función de navegación opcional para redirigir tras el cierre de sesión
 */
export const signOut = async (navigate?: (path: string) => void) => {
  try {
    localStorage.clear();

    localStorage.removeItem('clientLoggedIn');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientUserId');
    localStorage.removeItem('trainerLoggedIn');
    localStorage.removeItem('trainerEmail');
    localStorage.removeItem('trainerName');

    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('sb-')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    await supabase.auth.signOut();

    console.log("Sesión cerrada y datos locales eliminados completamente");

    if (navigate) {
      navigate("/login");
    }

    return true;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    if (navigate) {
      navigate("/login");
    }

    return false;
  }
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
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Error al iniciar sesión con email y contraseña:", error);
      throw error;
    }
    
    console.log("Inicio de sesión exitoso:", data);
    
    if (data.user) {
      localStorage.setItem('clientLoggedIn', 'true');
      localStorage.setItem('clientEmail', email);
      localStorage.setItem('clientUserId', data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error("Error en signInWithPassword:", error);
    throw error;
  }
};

/**
 * Registra un nuevo usuario con email y contraseña
 */
export const signUpWithPassword = async (email: string, password: string) => {
  console.log("Registrando nuevo usuario con email:", email);
  
  try {
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
    
    if (data.user) {
      localStorage.setItem('clientLoggedIn', 'true');
      localStorage.setItem('clientEmail', email);
      localStorage.setItem('clientUserId', data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error("Error en signUpWithPassword:", error);
    throw error;
  }
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
 * Busca el ID de un usuario autenticado por su email
 * @param email Email del usuario
 * @returns ID del usuario si existe, undefined si no
 */
export const findAuthUserIdByEmail = async (email: string) => {
  try {
    if (!email) return undefined;
    
    console.log("Buscando ID de usuario auth por email:", email);
    
    const { data, error } = await supabase
      .rpc('get_user_id_by_email', { 
        email_input: email 
      });
    
    if (error) {
      console.error("Error buscando ID de usuario auth:", error);
      return undefined;
    }
    
    console.log("ID encontrado:", data);
    return data;
  } catch (error) {
    console.error("Error inesperado buscando ID de usuario auth:", error);
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
    let finalUserId = userId;
    
    if (!finalUserId) {
      console.log("ID no proporcionado, buscando alternativas...");
      
      finalUserId = localStorage.getItem('clientUserId');
      console.log("ID desde localStorage:", finalUserId);
      
      if (!finalUserId) {
        const session = await getActiveSession();
        finalUserId = session?.user?.id;
        console.log("ID desde sesión activa:", finalUserId);
        
        if (!finalUserId) {
          const email = localStorage.getItem('clientEmail') || clientData.email;
          if (email) {
            finalUserId = await findAuthUserIdByEmail(email);
            console.log("ID encontrado por email:", finalUserId);
          }
        }
      }
    }
    
    if (!finalUserId) {
      console.error("No se pudo determinar el ID del usuario después de múltiples intentos");
      throw new Error("No se pudo determinar el ID del usuario");
    }
    
    console.log("Guardando perfil para usuario ID:", finalUserId, "con datos:", clientData);
    
    const profileData = {
      id: finalUserId,
      ...clientData
    };
    
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

/**
 * Crea o actualiza el perfil de un entrenador
 * @param trainerData Datos del entrenador a guardar
 * @param userId ID del usuario (opcional)
 */
export const saveTrainerProfile = async (trainerData: any, userId?: string) => {
  try {
    let finalUserId = userId;
    
    if (!finalUserId) {
      const currentUser = await getCurrentUser();
      finalUserId = currentUser?.id;
      
      if (!finalUserId) {
        throw new Error("No se pudo determinar el ID del usuario");
      }
    }
    
    console.log("Guardando perfil de entrenador con ID:", finalUserId);
    
    const profileData = {
      id: finalUserId,
      ...trainerData
    };
    
    const { data, error } = await supabase.rpc('save_trainer_profile', {
      trainer_data: profileData
    });
    
    if (error) {
      console.error("Error guardando perfil del entrenador:", error);
      throw error;
    }
    
    console.log("Perfil de entrenador guardado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error inesperado guardando perfil de entrenador:", error);
    throw error;
  }
};
