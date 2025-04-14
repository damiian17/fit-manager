
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  User
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { getClients, deleteClient } from "@/utils/clientStorage";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Load clients from storage
    const loadedClients = getClients();
    setClients(loadedClients);
  }, []);

  // Filter clients based on search term and status
  const filteredClients = clients
    .filter((client) => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.goals && client.goals.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((client) => 
      filterStatus === "all" ? true : client.status === filterStatus
    );

  const handleDelete = (clientId: number) => {
    // Delete client from storage
    deleteClient(clientId);
    
    // Update state
    setClients(clients.filter(client => client.id !== clientId));
    toast.success("Cliente eliminado correctamente");
  };

  const getBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "principiante":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "intermedio":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "avanzado":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactivo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Clientes</h1>
          
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              className="border-fitBlue-200 text-fitBlue-700"
              onClick={() => setFilterStatus(filterStatus === "all" ? "active" : "all")}
            >
              <Filter className="mr-2 h-4 w-4" />
              {filterStatus === "all" ? "Todos" : "Activos"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="border-fitBlue-200 text-fitBlue-700">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            
            <Button 
              className="bg-fitBlue-600 hover:bg-fitBlue-700"
              onClick={() => navigate("/clients/new")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Añadir Cliente
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Buscar clientes por nombre, email o objetivo..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
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
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
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
                          <Badge className={getBadgeColor(client.fitnessLevel)}>
                            {client.fitnessLevel || "No especificado"}
                          </Badge>
                        </TableCell>
                        <TableCell>{client.goals || "No especificado"}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Clients;
