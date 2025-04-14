
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Client {
  id: string | number;
  name: string;
}

interface ClientSelectorProps {
  clientId: string;
  clientName: string;
  dietName: string;
  onClientChange: (value: string) => void;
  onClientNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDietNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clients?: Client[];
}

export const ClientSelector = ({ 
  clientId, 
  clientName, 
  dietName,
  onClientChange, 
  onClientNameChange,
  onDietNameChange,
  clients = []
}: ClientSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clientId">Seleccionar cliente (opcional)</Label>
        <Select onValueChange={onClientChange} value={clientId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un cliente existente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nuevo">Crear nuevo cliente</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id.toString()} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {clientId === "nuevo" && (
        <div className="space-y-2">
          <Label htmlFor="clientName">Nombre del cliente *</Label>
          <Input 
            id="clientName" 
            name="clientName" 
            value={clientName}
            onChange={onClientNameChange}
            placeholder="Nombre completo del cliente" 
            required={clientId === "nuevo"}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="dietName">Nombre del plan dietético *</Label>
        <Input 
          id="dietName" 
          name="dietName" 
          value={dietName}
          onChange={onDietNameChange}
          placeholder="Ej. Plan pérdida de peso - Fase 1" 
          required
        />
      </div>
    </div>
  );
};
