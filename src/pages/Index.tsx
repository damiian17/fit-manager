
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveSession, hasClientProfile } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Intentar obtener la sesión actual
        const session = await getActiveSession();
        
        // Si hay una sesión activa
        if (session) {
          const clientLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
          
          if (clientLoggedIn) {
            // Verificar si el cliente ya tiene un perfil completo
            const hasProfile = await hasClientProfile(session.user.id);
            
            if (hasProfile) {
              // Si tiene perfil completo, ir al portal del cliente
              navigate("/client-portal");
            } else {
              // Si no tiene perfil completo, ir a completar el perfil
              navigate("/client-register");
            }
          } else {
            // Si hay sesión pero no es cliente, es entrenador
            navigate("/dashboard");
          }
        } else {
          // Si no hay sesión, redirigir al login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        // En caso de error, redirigir al login por seguridad
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
