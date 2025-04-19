import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveSession, hasClientProfile } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session on Index page...");
        
        // Siempre redirigir a la página de login primero si no hay sesión
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/login");
          return;
        }
        
        console.log("Session found:", session.user.id);
        
        // Check if it's a client or trainer based on localStorage
        const clientLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
        const trainerLoggedIn = localStorage.getItem('trainerLoggedIn') === 'true';
        
        console.log("Login status:", { clientLoggedIn, trainerLoggedIn });
        
        if (clientLoggedIn) {
          // Verify if the client has a complete profile
          const hasProfile = await hasClientProfile(session.user.id);
          console.log("Client has profile:", hasProfile);
          
          if (hasProfile) {
            // If profile is complete, go to client portal
            navigate("/client-portal");
          } else {
            // If profile is incomplete, go to profile completion
            navigate("/client-register");
          }
        } else if (trainerLoggedIn) {
          // If it's a trainer, go to dashboard
          navigate("/dashboard");
        } else {
          // Si hay sesión pero no se ha identificado el tipo de usuario,
          // intentar determinar el tipo consultando la base de datos
          
          // Check if user is a client
          const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (clientData) {
            localStorage.setItem('clientLoggedIn', 'true');
            const hasProfile = await hasClientProfile(session.user.id);
            if (hasProfile) {
              navigate("/client-portal");
            } else {
              navigate("/client-register");
            }
            return;
          }
          
          // Check if user is a trainer
          const { data: trainerData } = await supabase
            .from('trainers')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (trainerData) {
            localStorage.setItem('trainerLoggedIn', 'true');
            navigate("/dashboard");
            return;
          }
          
          // Si no es cliente ni entrenador pero tiene sesión,
          // probablemente sea una sesión inválida, ir a login
          console.log("Session exists but user not identified in database");
          // Limpiar sesión inválida
          await supabase.auth.signOut();
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // En caso de error, redirigir a login por seguridad
        navigate("/login");
      }
    };
    
    // Siempre comenzar verificando la ruta por defecto
    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
