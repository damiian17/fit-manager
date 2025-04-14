
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoInputsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    birthdate: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoInputs = ({ formData, handleChange }: PersonalInfoInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Ej. Ana García Pérez" 
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="Ej. cliente@ejemplo.com" 
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="Ej. +34 612 345 678" 
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthdate">Fecha de nacimiento</Label>
        <Input 
          id="birthdate" 
          name="birthdate" 
          type="date" 
          value={formData.birthdate}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PersonalInfoInputs;
