
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClients, Client } from "@/utils/clientStorage";

interface ClientSelectorProps {
  formData: {
    clientId: string;
    clientName: string;
    workoutName: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => Promise<void>;
}

export const ClientSelector = ({ formData, handleChange, handleSelectChange }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      const clientsList = await getClients();
      setClients(clientsList);
    };
    loadClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clientId">Seleccionar cliente (opcional)</Label>
        <Select onValueChange={(value) => handleSelectChange("clientId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un cliente existente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nuevo">Crear nuevo cliente</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {formData.clientId === "nuevo" && (
        <div className="space-y-2">
          <Label htmlFor="clientName">Nombre del cliente *</Label>
          <Input 
            id="clientName" 
            name="clientName" 
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Nombre completo del cliente" 
            required={formData.clientId === "nuevo"}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="workoutName">Nombre de la rutina *</Label>
        <Input 
          id="workoutName" 
          name="workoutName" 
          value={formData.workoutName}
          onChange={handleChange}
          placeholder="Ej. Rutina de fuerza - Fase 1" 
          required
        />
      </div>
    </div>
  );
};
