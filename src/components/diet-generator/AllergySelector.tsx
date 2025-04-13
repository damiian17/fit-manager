
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AllergySelectorProps {
  allergies: string[];
  foodOptions: string[];
  onToggleAllergy: (allergy: string) => void;
}

export const AllergySelector = ({ allergies, foodOptions, onToggleAllergy }: AllergySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Alimentos prohibidos/alergias (opcional)</Label>
      <Select 
        onValueChange={(value) => onToggleAllergy(value)}
        value=""
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona alimentos prohibidos" />
        </SelectTrigger>
        <SelectContent>
          {foodOptions.map((food) => (
            <SelectItem key={food} value={food}>{food}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Lista de alimentos seleccionados */}
      {allergies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {allergies.map((allergy) => (
            <div 
              key={allergy} 
              className="bg-fitGreen-100 text-fitGreen-800 text-xs font-medium px-2 py-1 rounded-md flex items-center"
            >
              {allergy}
              <button 
                type="button"
                onClick={() => onToggleAllergy(allergy)}
                className="ml-1 text-fitGreen-600 hover:text-fitGreen-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
