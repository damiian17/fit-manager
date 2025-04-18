
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PhysicalInfoInputsProps {
  formData: {
    age: string;
    weight: string;
    height: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhysicalInfoInputs = ({ formData, handleChange }: PhysicalInfoInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="age">Edad *</Label>
        <Input 
          id="age" 
          name="age" 
          type="number" 
          placeholder="Ej. 30" 
          value={formData.age}
          onChange={handleChange}
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
          value={formData.weight}
          onChange={handleChange}
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
          value={formData.height}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};
