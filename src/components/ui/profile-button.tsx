
import React, { useState } from "react";
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
import { Link } from "react-router-dom";

interface ClientInfo {
  name: string;
  email: string;
  membership: string;
}

export const ProfileButton = () => {
  // Mock client data - in a real app, this would come from an API or context
  const [clientInfo] = useState<ClientInfo>({
    name: "María García",
    email: "maria.garcia@ejemplo.com",
    membership: "Premium"
  });

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
        <DropdownMenuItem>
          <Link to="/login" className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
