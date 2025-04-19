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
        
        // Check if there's an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Si no hay sesión, siempre redirigir a la página de login
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
          // Check the database to determine the user type if not in localStorage
          // First check if user is a client
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
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
          const { data: trainerData, error: trainerError } = await supabase
            .from('trainers')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
          if (trainerData) {
            localStorage.setItem('trainerLoggedIn', 'true');
            navigate("/dashboard");
            return;
          }
          
          // Si no es cliente ni entrenador pero tiene sesión, ir a login
          console.log("Session exists but user not identified in database");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // En caso de error, redirigir a login por seguridad
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
