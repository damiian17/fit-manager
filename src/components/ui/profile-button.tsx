
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getActiveSession, signOut } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientInfo {
  name: string;
  email: string;
  membership?: string;
}

export const ProfileButton = () => {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    email: "",
    membership: "Standard"
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getActiveSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Obtener datos del perfil desde la base de datos
        const { data, error } = await supabase
          .from('clients')
          .select('name, email')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error al obtener perfil:", error);
          return;
        }

        if (data) {
          setClientInfo({
            name: data.name,
            email: data.email || session.user.email || "",
            membership: "Premium" // Puedes ajustar esto según tus necesidades
          });
        } else {
          // Si no hay datos en la tabla de clientes, usar datos de la sesión
          setClientInfo({
            name: session.user.user_metadata?.full_name || "Cliente",
            email: session.user.email || "",
            membership: "Standard"
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Usar la función signOut que limpia todos los datos
      await signOut();
      
      toast.success("Sesión cerrada correctamente");
      
      // Redirigir al usuario a la página de login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
      
      // En caso de error, intentar redirigir de todos modos
      navigate("/login", { replace: true });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{clientInfo.name}</p>
          <p className="text-xs text-muted-foreground">{clientInfo.email}</p>
          <div className="mt-1">
            <span className="inline-flex items-center rounded-full bg-fitBlue-100 px-2.5 py-0.5 text-xs font-medium text-fitBlue-800">
              {clientInfo.membership}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/client-profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/client-settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Ajustes</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <div className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
