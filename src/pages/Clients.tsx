
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getClients } from "@/utils/clientStorage";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { SearchBar } from "@/components/clients/SearchBar";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { toast } from "sonner";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load clients from Supabase
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const loadedClients = await getClients();
        setClients(loadedClients);
      } catch (error) {
        console.error("Error loading clients:", error);
        toast.error("Error al cargar los clientes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container">
        <ClientsHeader 
          filterStatus={filterStatus} 
          setFilterStatus={setFilterStatus} 
        />
        
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center">
                <p>Cargando clientes...</p>
              </div>
            ) : (
              <ClientsTable 
                clients={filteredClients} 
                setClients={setClients} 
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Clients;
