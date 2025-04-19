// src/App.tsx o archivo principal de rutas
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Importa tus páginas/componentes
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ClientRegisterPage from "@/pages/ClientRegisterPage";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import { getActiveSession } from "@/utils/authUtils";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const session = await getActiveSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
        
        {/* Ruta de registro de cliente - solo accesible después de autenticación */}
        <Route 
          path="/client-register" 
          element={
            user ? (
              // Verificar si el usuario necesita completar el registro
              user.user_metadata?.needsToCompleteRegistration ? 
                <ClientRegisterPage /> : 
                <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} />
        
        {/* Otras rutas protegidas... */}
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
