
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientSelectorProps {
  clientId: string;
  onClientChange: (clientId: string) => void;
}

export const ClientSelector = ({ clientId, onClientChange }: ClientSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Seleccionar cliente (opcional)</Label>
      <Select onValueChange={onClientChange} value={clientId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Ana García</SelectItem>
          <SelectItem value="2">Carlos Pérez</SelectItem>
          <SelectItem value="3">Laura Sánchez</SelectItem>
          <SelectItem value="4">Javier Rodríguez</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
