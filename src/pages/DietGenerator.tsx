
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DietForm } from "@/components/diet-generator/DietForm";
import { DietPlan } from "@/components/diet-generator/DietPlan";
import { NutritionalTips } from "@/components/diet-generator/NutritionalTips";
import { generatedDietData } from "@/data/mockDiet";

const DietGenerator = () => {
  const navigate = useNavigate();
  const [dietGenerated, setDietGenerated] = useState(false);

  const handleDietGenerated = () => {
    setDietGenerated(true);
  };

  const handleResetForm = () => {
    setDietGenerated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="fit-container pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/diets")} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Generador de Dietas</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!dietGenerated ? (
              <DietForm onDietGenerated={handleDietGenerated} />
            ) : (
              <DietPlan 
                generatedDiet={generatedDietData}
                onReset={handleResetForm}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <NutritionalTips />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DietGenerator;
