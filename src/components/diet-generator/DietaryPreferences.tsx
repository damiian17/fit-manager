
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DietaryPreferencesProps {
  meals: string;
  activityLevel: string;
  goal: string;
  dietType: string;
  onSelectChange: (name: string, value: string) => void;
}

export const DietaryPreferences = ({
  meals,
  activityLevel,
  goal,
  dietType,
  onSelectChange
}: DietaryPreferencesProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="meals">Comidas diarias *</Label>
          <Select 
            onValueChange={(value) => onSelectChange("meals", value)}
            value={meals}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona cantidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 comidas</SelectItem>
              <SelectItem value="3">3 comidas</SelectItem>
              <SelectItem value="4">4 comidas</SelectItem>
              <SelectItem value="5">5 comidas</SelectItem>
              <SelectItem value="6">6 comidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
        <div className="space-y-2">
          <Label htmlFor="activityLevel">Nivel de actividad física *</Label>
          <Select 
            onValueChange={(value) => onSelectChange("activityLevel", value)}
            value={activityLevel}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentario (poco o nada de ejercicio)</SelectItem>
              <SelectItem value="light">Ligero (ejercicio ligero 1-3 días/semana)</SelectItem>
              <SelectItem value="moderate">Moderado (ejercicio moderado 3-5 días/semana)</SelectItem>
              <SelectItem value="active">Intenso (ejercicio intenso 6-7 días/semana)</SelectItem>
              <SelectItem value="very_active">Muy intenso (ejercicio intenso diario o físicamente exigente)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="goal">Objetivo nutricional *</Label>
          <Select 
            onValueChange={(value) => onSelectChange("goal", value)}
            value={goal}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Pérdida de peso</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
              <SelectItem value="muscle_gain">Ganancia de masa muscular</SelectItem>
              <SelectItem value="performance">Rendimiento deportivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
        <div className="space-y-2">
          <Label htmlFor="dietType">Tipo de dieta *</Label>
          <Select 
            onValueChange={(value) => onSelectChange("dietType", value)}
            value={dietType}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bulk">Bulk</SelectItem>
              <SelectItem value="Defi">Defi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
