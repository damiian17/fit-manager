
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Trash2, Pencil, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface DietHeaderProps {
  onBack: () => void;
  onDelete?: () => void;
  isClientView?: boolean;
  onRequestChange?: () => void;
  name: string;
  description: string;
}

export const DietHeader = ({ 
  onBack, 
  onDelete, 
  isClientView, 
  onRequestChange, 
  name, 
  description 
}: DietHeaderProps) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        {!isClientView ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => toast.info("Funcionalidad de edición en desarrollo")}
              size="sm"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar dieta
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar dieta
            </Button>
          </div>
        ) : (
          onRequestChange && (
            <Button 
              variant="outline" 
              onClick={onRequestChange}
              size="sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Solicitar cambio
            </Button>
          )
        )}
      </div>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  );
};
