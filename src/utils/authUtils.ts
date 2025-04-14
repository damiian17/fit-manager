
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
 * Verifica si un usuario tiene perfil de cliente
 * @param userId ID del usuario
 * @returns True si tiene perfil, false si no
 */
export const hasClientProfile = async (userId: string) => {
  const { data } = await supabase
    .from('clients')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  return !!data;
};

/**
 * Cierra la sesión del usuario
 */
export const signOut = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('clientLoggedIn');
  localStorage.removeItem('clientEmail');
};
