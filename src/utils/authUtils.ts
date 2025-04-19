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
    // Limpiar localStorage completamente para asegurar que no queden datos de sesión
    localStorage.clear();

    // También limpiar los elementos específicos por seguridad (redundante pero asegura)
    localStorage.removeItem('clientLoggedIn');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientUserId');
    localStorage.removeItem('trainerLoggedIn');
    localStorage.removeItem('trainerEmail');
    localStorage.removeItem('trainerName');

    // Limpiar las cookies de Supabase
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('sb-')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    // Finalmente cerrar sesión en Supabase
    await supabase.auth.signOut();

    console.log("Sesión cerrada y datos locales eliminados completamente");

    // Siempre forzar la redirección a la página de login al cerrar sesión
    if (navigate) {
      navigate("/login");
    }

    return true;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    // En caso de error, también redirigir a login para evitar quedarse en estado incorrecto
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
    
    // Guardar información en localStorage
    if (data.user) {
      localStorage.setItem('clientLoggedIn', 'true');
      localStorage.setItem('clientEmail', email);
      localStorage.setItem('clientUserId', data.user.id); // Guardar ID de usuario
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
    
    // Guardar información en localStorage incluyendo el ID
    if (data.user) {
      localStorage.setItem('clientLoggedIn', 'true');
      localStorage.setItem('clientEmail', email);
      localStorage.setItem('clientUserId', data.user.id); // Guardar ID de usuario
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
    
    // Intentar obtener usuario desde auth.users mediante función RPC
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
    // Múltiples métodos para obtener el ID del usuario
    let finalUserId = userId;
    
    if (!finalUserId) {
      console.log("ID no proporcionado, buscando alternativas...");
      
      // 1. Intentar obtener desde localStorage
      finalUserId = localStorage.getItem('clientUserId');
      console.log("ID desde localStorage:", finalUserId);
      
      // 2. Si no hay ID en localStorage, intentar obtener desde la sesión actual
      if (!finalUserId) {
        const session = await getActiveSession();
        finalUserId = session?.user?.id;
        console.log("ID desde sesión activa:", finalUserId);
        
        // 3. Si no hay sesión, intentar buscar por email
        if (!finalUserId) {
          const email = localStorage.getItem('clientEmail') || clientData.email;
          if (email) {
            finalUserId = await findAuthUserIdByEmail(email);
            console.log("ID encontrado por email:", finalUserId);
          }
        }
      }
    }
    
    // Verificación final
    if (!finalUserId) {
      console.error("No se pudo determinar el ID del usuario después de múltiples intentos");
      throw new Error("No se pudo determinar el ID del usuario");
    }
    
    console.log("Guardando perfil para usuario ID:", finalUserId, "con datos:", clientData);
    
    // Preparar datos para guardar
    const profileData = {
      id: finalUserId,
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

/**
 * Crea o actualiza el perfil de un entrenador
 * @param trainerData Datos del entrenador a guardar
 * @param userId ID del usuario (opcional)
 */
export const saveTrainerProfile = async (trainerData: any, userId?: string) => {
  try {
    // Si no se proporciona el ID del usuario, usar el usuario actual
    let finalUserId = userId;
    
    if (!finalUserId) {
      // Obtener el usuario actual
      const currentUser = await getCurrentUser();
      finalUserId = currentUser?.id;
      
      if (!finalUserId) {
        throw new Error("No se pudo determinar el ID del usuario");
      }
    }
    
    console.log("Guardando perfil de entrenador con ID:", finalUserId);
    
    // Preparar datos para guardar
    const profileData = {
      id: finalUserId,
      ...trainerData
    };
    
    // Usar una función RPC para guardar el perfil del entrenador
    // Esto nos permite eludir las políticas RLS ya que la función se ejecuta con privilegios elevados
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
