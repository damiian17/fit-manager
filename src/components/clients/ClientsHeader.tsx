
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, Filter, Download, ChevronDown } from "lucide-react";

interface ClientsHeaderProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export const ClientsHeader = ({ filterStatus, setFilterStatus }: ClientsHeaderProps) => {
  const navigate = useNavigate();

  return (
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
  );
};
