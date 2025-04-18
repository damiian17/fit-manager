
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface WorkoutPreferencesProps {
  formData: {
    fitnessLevel: string;
    workoutType: string;
    goals: string;
    limitations: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => Promise<void>;
}

export const WorkoutPreferences = ({ formData, handleChange, handleSelectChange }: WorkoutPreferencesProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fitnessLevel">Nivel de fitness *</Label>
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
        
        <div className="space-y-2">
          <Label htmlFor="workoutType">Tipo de entrenamiento *</Label>
          <Select 
            onValueChange={(value) => handleSelectChange("workoutType", value)}
            value={formData.workoutType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fuerza">Fuerza</SelectItem>
              <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
              <SelectItem value="resistencia">Resistencia</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="flexibilidad">Flexibilidad</SelectItem>
              <SelectItem value="mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Objetivos específicos</Label>
        <Textarea 
          id="goals" 
          name="goals" 
          placeholder="Describe los objetivos específicos que se quieren conseguir con esta rutina..." 
          value={formData.goals}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="limitations">Limitaciones físicas/lesiones (opcional)</Label>
        <Textarea 
          id="limitations" 
          name="limitations" 
          placeholder="Indica cualquier limitación física o lesión que se deba tener en cuenta..." 
          value={formData.limitations}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
