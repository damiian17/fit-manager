
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GoalsAndMedicalInputsProps {
  formData: {
    goals: string;
    medicalHistory: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GoalsAndMedicalInputs = ({ formData, handleChange }: GoalsAndMedicalInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="goals">Objetivos de fitness</Label>
        <Textarea 
          id="goals" 
          name="goals" 
          placeholder="Describe los objetivos de fitness del cliente (pérdida de peso, ganancia muscular, etc.)..." 
          className="min-h-[100px]"
          value={formData.goals}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Historial médico relevante (opcional)</Label>
        <Textarea 
          id="medicalHistory" 
          name="medicalHistory" 
          placeholder="Indica cualquier información médica relevante (lesiones, condiciones, alergias, etc.)..." 
          className="min-h-[100px]"
          value={formData.medicalHistory}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default GoalsAndMedicalInputs;
