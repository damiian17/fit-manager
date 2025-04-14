
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactivo</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export const getLevelBadgeColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "principiante":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "intermedio":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "avanzado":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};
