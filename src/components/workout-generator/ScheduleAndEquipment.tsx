
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleAndEquipmentProps {
  formData: {
    daysPerWeek: string[];
    duration: string;
    equipment: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDay: (day: string) => void;
  toggleEquipment: (equipment: string) => void;
}

export const ScheduleAndEquipment = ({ 
  formData, 
  handleChange, 
  toggleDay, 
  toggleEquipment 
}: ScheduleAndEquipmentProps) => {
  const workoutDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const equipmentOptions = [
    "Mancuernas", "Barras", "Máquinas de gimnasio", "Bandas elásticas", 
    "Kettlebells", "TRX/Suspensión", "Balón medicinal", "Step", "Ninguno"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Días disponibles por semana</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {workoutDays.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={formData.daysPerWeek.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              <label
                htmlFor={`day-${day}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duración deseada por sesión (minutos)</Label>
        <Input 
          id="duration" 
          name="duration" 
          type="number" 
          placeholder="Ej. 60" 
          value={formData.duration}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Equipamiento disponible</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {equipmentOptions.map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${equipment}`}
                checked={formData.equipment.includes(equipment)}
                onCheckedChange={() => toggleEquipment(equipment)}
              />
              <label
                htmlFor={`equipment-${equipment}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {equipment}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
