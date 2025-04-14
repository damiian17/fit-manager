
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Salad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Datos de ejemplo - en una aplicación real se obtendrían de la base de datos
const clientDiets = [
  {
    clientId: "1",
    clientName: "Ana García",
    diets: [
      { id: "1", name: "Plan Pérdida de Peso - Fase 1", startDate: "15/04/2025", endDate: "15/05/2025", status: "Activa" },
      { id: "2", name: "Plan Mantenimiento", startDate: "15/03/2025", endDate: "15/04/2025", status: "Completada" }
    ]
  },
  {
    clientId: "2",
    clientName: "Carlos Pérez",
    diets: [
      { id: "3", name: "Dieta Hiperproteica", startDate: "01/04/2025", endDate: "01/05/2025", status: "Activa" }
    ]
  },
  {
    clientId: "3",
    clientName: "Laura Sánchez",
    diets: [
      { id: "4", name: "Plan Ganancia Muscular", startDate: "10/04/2025", endDate: "10/05/2025", status: "Activa" },
      { id: "5", name: "Dieta de Definición", startDate: "10/03/2025", endDate: "10/04/2025", status: "Completada" },
      { id: "6", name: "Plan Inicial", startDate: "10/02/2025", endDate: "10/03/2025", status: "Completada" }
    ]
  },
  {
    clientId: "4",
    clientName: "Javier Rodríguez",
    diets: [
      { id: "7", name: "Plan Personalizado", startDate: "05/04/2025", endDate: "05/05/2025", status: "Activa" }
    ]
  }
];

export const ClientDiets = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Salad className="mr-2 h-6 w-6 text-fitBlue-600" />
          Dietas por Cliente
        </CardTitle>
        <CardDescription>
          Gestiona las dietas asignadas a cada cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link to="/diets/new">Nueva Dieta</Link>
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {clientDiets.map((client) => (
            <AccordionItem key={client.clientId} value={client.clientId}>
              <AccordionTrigger className="hover:bg-gray-100 px-4 rounded-md">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{client.clientName}</span>
                  <Badge>{client.diets.length} dieta(s)</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4 pr-2 py-2">
                  {client.diets.map((diet) => (
                    <div 
                      key={diet.id} 
                      className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-md border"
                    >
                      <div>
                        <p className="font-medium">{diet.name}</p>
                        <p className="text-sm text-gray-500">
                          {diet.startDate} - {diet.endDate}
                        </p>
                      </div>
                      <Badge variant={diet.status === "Activa" ? "default" : "secondary"}>
                        {diet.status}
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
