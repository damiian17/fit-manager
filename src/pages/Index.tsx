
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasClientProfile } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session on Index page...");
        
        // Check if there's an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
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
              // If profile is incomplete, instead of going to register page,
              // redirect to login so user explicitly logs in and can be taken through proper onboarding
              navigate("/login");
            }
          } else if (trainerLoggedIn) {
            // If it's a trainer, go to dashboard
            navigate("/dashboard");
          } else {
            // Check the database to determine the user type if not in localStorage
            // First check if user is a client
            const { data: clientData } = await supabase
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
                navigate("/login");
              }
              return;
            }
            
            // Check if user is a trainer
            const { data: trainerData } = await supabase
              .from('trainers')
              .select('id')
              .eq('id', session.user.id)
              .single();
              
            if (trainerData) {
              localStorage.setItem('trainerLoggedIn', 'true');
              navigate("/dashboard");
              return;
            }
            
            // Unknown user, navigate to login
            console.log("Session exists but user not identified in database");
            navigate("/login");
          }
        } else {
          // Si no hay sesión, siempre ir a login
          console.log("No session found, redirecting to login");
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

