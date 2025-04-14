
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Match the type from Dashboard.tsx
interface ClientData {
  id: string;
  name: string;
  goal: string;
  level: string;
  lastVisit: string;
}

interface RecentClientsProps {
  clients: ClientData[];
}

export const RecentClients = ({ clients }: RecentClientsProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Clientes Recientes</CardTitle>
          <Link to="/clients">
            <Button variant="ghost" size="sm" className="text-fitBlue-600">
              Ver todos
            </Button>
          </Link>
        </div>
        <CardDescription>
          Actividad reciente de tus clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.goal} • {client.level}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-4">{client.lastVisit}</span>
                <Button variant="ghost" size="sm" className="text-fitBlue-600">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
