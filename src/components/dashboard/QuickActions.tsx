import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Dumbbell, Salad } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/clients/new">
            <Button className="w-full" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Cliente
            </Button>
          </Link>
          <Link to="/workouts/new">
            <Button className="w-full" variant="outline">
              <Dumbbell className="mr-2 h-4 w-4" />
              Crear Rutina
            </Button>
          </Link>
          <Link to="/diets/new">
            <Button className="w-full" variant="outline">
              <Salad className="mr-2 h-4 w-4" />
              Crear Dieta
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
