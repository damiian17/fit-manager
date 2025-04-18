
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Trash2, MessageSquare } from "lucide-react";

interface WorkoutHeaderProps {
  onBack: () => void;
  onDelete?: () => void;
  isClientView?: boolean;
  onRequestChange?: () => void;
  title: string;
  description: string;
}

export const WorkoutHeader = ({
  onBack,
  onDelete,
  isClientView,
  onRequestChange,
  title,
  description
}: WorkoutHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {!isClientView ? (
        <Button 
          variant="destructive" 
          onClick={onDelete}
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar rutina
        </Button>
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
  );
};
