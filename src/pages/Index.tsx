
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

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("Session found:", session.user.id);

          const clientLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
          const trainerLoggedIn = localStorage.getItem('trainerLoggedIn') === 'true';

          console.log("Login status:", { clientLoggedIn, trainerLoggedIn });

          if (clientLoggedIn) {
            // Solo ir a client portal si tiene perfil completo
            const hasProfile = await hasClientProfile(session.user.id);
            console.log("Client has profile:", hasProfile);

            if (hasProfile) {
              navigate("/client-portal");
            } else {
              // Ya no redirigir automáticamente a client-register
              // Mejor forzar login para completar manualmente perfil
              navigate("/login");
            }

          } else if (trainerLoggedIn) {
            navigate("/dashboard");
          } else {
            // Determinar tipo usuario con DB
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
                // Ya no redirigir a client-register en index
                navigate("/login");
              }
              return;
            }

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
