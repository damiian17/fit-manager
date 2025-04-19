
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

          // Check login state flags in localStorage
          const clientLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
          const trainerLoggedIn = localStorage.getItem('trainerLoggedIn') === 'true';

          console.log("Login status:", { clientLoggedIn, trainerLoggedIn });

          if (clientLoggedIn) {
            // Verify if client has complete profile
            const hasProfile = await hasClientProfile(session.user.id);
            console.log("Client has profile:", hasProfile);

            if (hasProfile) {
              // Profile complete: go to client portal
              navigate("/client-portal");
            } else {
              // Profile incomplete: Only go to client register if just registered (for new users)
              // But here redirect to login so explicit login/onboarding
              navigate("/login");
            }
          } else if (trainerLoggedIn) {
            // If trainer, go directly to dashboard, never to client register
            navigate("/dashboard");
          } else {
            // Determine user type from DB if no login flags set

            // Check if user is client
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
                // NEVER redirect directly to client-register here on app start,
                // force login so onboarding flow is explicit
                navigate("/login");
              }
              return;
            }

            // Check if user is trainer
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

            // Unknown user
            console.log("Session exists but user not identified in database");
            navigate("/login");
          }
        } else {
          console.log("No session found, redirecting to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
