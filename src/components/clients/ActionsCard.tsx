
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionsCardProps {
  isSubmitting: boolean;
}

const ActionsCard = ({ isSubmitting }: ActionsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="submit" className="w-full bg-fitBlue-600 hover:bg-fitBlue-700" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar Cliente"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/clients")}
        >
          Cancelar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
