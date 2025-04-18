
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface ChangeRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
}

export const ChangeRequestDialog = ({
  isOpen,
  onOpenChange,
  message,
  onMessageChange,
  onSubmit,
}: ChangeRequestDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Solicitar cambio en la dieta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="changeMessage">Describe los cambios que necesitas</Label>
            <Textarea 
              id="changeMessage" 
              value={message} 
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
              placeholder="Por favor, explica qué cambios necesitas en esta dieta..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSubmit} className="bg-fitBlue-600 hover:bg-fitBlue-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar solicitud
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
