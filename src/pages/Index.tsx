
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
        const session = await getActiveSession();
        
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
              // If profile is incomplete, go to profile completion
              navigate("/client-register");
            }
          } else if (trainerLoggedIn) {
            // If it's a trainer, go to dashboard
            navigate("/dashboard");
          } else {
            // If we have a session but no role is defined, default to login
            console.log("Session exists but no role defined, redirecting to login");
            navigate("/login");
          }
        } else {
          // If there's no session, always go to login
          console.log("No session found, redirecting to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // In case of error, redirect to login for safety
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
