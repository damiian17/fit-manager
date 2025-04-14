
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Datos de ejemplo - en una aplicación real se obtendrían de la base de datos
const clientWorkouts = [
  {
    clientId: "1",
    clientName: "Ana García",
    workouts: [
      { id: "1", name: "Rutina de Fuerza - Fase 1", startDate: "15/04/2025", endDate: "15/05/2025", status: "Activa" },
      { id: "2", name: "Rutina de Adaptación", startDate: "15/03/2025", endDate: "15/04/2025", status: "Completada" }
    ]
  },
  {
    clientId: "2",
    clientName: "Carlos Pérez",
    workouts: [
      { id: "3", name: "Hipertrofia - Upper/Lower", startDate: "01/04/2025", endDate: "01/05/2025", status: "Activa" }
    ]
  },
  {
    clientId: "3",
    clientName: "Laura Sánchez",
    workouts: [
      { id: "4", name: "Full Body 3x", startDate: "10/04/2025", endDate: "10/05/2025", status: "Activa" },
      { id: "5", name: "Push Pull Legs", startDate: "10/03/2025", endDate: "10/04/2025", status: "Completada" },
      { id: "6", name: "Iniciación", startDate: "10/02/2025", endDate: "10/03/2025", status: "Completada" }
    ]
  },
  {
    clientId: "4",
    clientName: "Javier Rodríguez",
    workouts: [
      { id: "7", name: "Plan Personalizado", startDate: "05/04/2025", endDate: "05/05/2025", status: "Activa" }
    ]
  }
];

export const ClientWorkouts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Dumbbell className="mr-2 h-6 w-6 text-fitBlue-600" />
          Rutinas por Cliente
        </CardTitle>
        <CardDescription>
          Gestiona las rutinas asignadas a cada cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link to="/workouts/new">Nueva Rutina</Link>
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {clientWorkouts.map((client) => (
            <AccordionItem key={client.clientId} value={client.clientId}>
              <AccordionTrigger className="hover:bg-gray-100 px-4 rounded-md">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{client.clientName}</span>
                  <Badge>{client.workouts.length} rutina(s)</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4 pr-2 py-2">
                  {client.workouts.map((workout) => (
                    <div 
                      key={workout.id} 
                      className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-md border"
                    >
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-gray-500">
                          {workout.startDate} - {workout.endDate}
                        </p>
                      </div>
                      <Badge variant={workout.status === "Activa" ? "default" : "secondary"}>
                        {workout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
