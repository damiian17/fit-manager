
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhysicalInfoInputsProps {
  age: string;
  weight: string;
  height: string;
  sex: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const PhysicalInfoInputs = ({ 
  age, 
  weight, 
  height, 
  sex, 
  onInputChange, 
  onSelectChange 
}: PhysicalInfoInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="age">Edad *</Label>
        <Input 
          id="age" 
          name="age" 
          type="number" 
          placeholder="Ej. 30" 
          value={age}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="weight">Peso (kg) *</Label>
        <Input 
          id="weight" 
          name="weight" 
          type="number" 
          placeholder="Ej. 70" 
          value={weight}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="height">Altura (cm) *</Label>
        <Input 
          id="height" 
          name="height" 
          type="number" 
          placeholder="Ej. 175" 
          value={height}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sex">Sexo *</Label>
        <Select 
          onValueChange={(value) => onSelectChange("sex", value)}
          value={sex}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Masculino</SelectItem>
            <SelectItem value="female">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
