
import { Button } from "@/components/ui/button";
import { Filter, Download, ChevronDown, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InviteCodeGenerator } from "@/components/trainer/InviteCodeGenerator";

interface ClientsHeaderProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export const ClientsHeader = ({ filterStatus, setFilterStatus }: ClientsHeaderProps) => {
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-fitBlue-600 hover:bg-fitBlue-700">
              <Key className="mr-2 h-4 w-4" />
              Generar Código de Invitación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generar Código de Invitación</DialogTitle>
              <DialogDescription>
                Genera un código para que tus clientes se registren y queden vinculados a tu cuenta
              </DialogDescription>
            </DialogHeader>
            <InviteCodeGenerator />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
