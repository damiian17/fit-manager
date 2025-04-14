
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PhysicalAttributesInputsProps {
  formData: {
    height: string;
    weight: string;
    fitnessLevel: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const PhysicalAttributesInputs = ({ 
  formData, 
  handleChange, 
  handleSelectChange 
}: PhysicalAttributesInputsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input 
            id="height" 
            name="height" 
            type="number" 
            placeholder="Ej. 170" 
            value={formData.height}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input 
            id="weight" 
            name="weight" 
            type="number" 
            placeholder="Ej. 65" 
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fitnessLevel">Nivel de fitness</Label>
        <Select 
          onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
          value={formData.fitnessLevel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="principiante">Principiante</SelectItem>
            <SelectItem value="intermedio">Intermedio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
            <SelectItem value="elite">Elite</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PhysicalAttributesInputs;
