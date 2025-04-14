
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, User } from "lucide-react";
import { StatusBadge, getLevelBadgeColor } from "./StatusBadge";
import { toast } from "sonner";
import { deleteClient } from "@/utils/clientStorage";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  age?: number;
  fitnessLevel?: string;
  goals?: string;
  status: string;
}

interface ClientsTableProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export const ClientsTable = ({ clients, setClients }: ClientsTableProps) => {
  const navigate = useNavigate();

  const handleDelete = (clientId: number) => {
    // Delete client from storage
    deleteClient(clientId);
    
    // Update state
    setClients(clients.filter(client => client.id !== clientId));
    toast.success("Cliente eliminado correctamente");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Objetivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{client.email}</p>
                    <p className="text-gray-500">{client.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{client.age}</TableCell>
                <TableCell>
                  <Badge className={getLevelBadgeColor(client.fitnessLevel)}>
                    {client.fitnessLevel || "No especificado"}
                  </Badge>
                </TableCell>
                <TableCell>{client.goals || "No especificado"}</TableCell>
                <TableCell><StatusBadge status={client.status} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(client.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No hay clientes registrados. ¡Añade tu primer cliente!</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
