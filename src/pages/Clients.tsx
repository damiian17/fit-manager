import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/utils/clientStorage";
import { toast } from "sonner";
import { InviteCodeGenerator } from "@/components/trainer/InviteCodeGenerator";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { SearchBar } from "@/components/clients/SearchBar";

const ActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Acciones</CardTitle>
      <CardDescription>
        Opciones rápidas para gestionar tus clientes
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>Acciones aquí...</p>
    </CardContent>
  </Card>
);

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const loadedClients = await getClients();
        console.log("Clientes cargados:", loadedClients);
        setClients(loadedClients);
        setFilteredClients(loadedClients);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        toast.error("Error al cargar los clientes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = [...clients];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(client => client.status === filterStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name?.toLowerCase().includes(term) || 
        client.email?.toLowerCase().includes(term) || 
        client.goals?.toLowerCase().includes(term)
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ClientsHeader filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  Aquí puedes ver y gestionar todos tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-4">Cargando clientes...</p>
                ) : (
                  <ClientsTable clients={filteredClients} setClients={setClients} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;
