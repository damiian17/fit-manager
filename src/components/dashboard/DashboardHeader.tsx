
import { Button } from "@/components/ui/button";
import { Bell, UserPlus } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
      <div className="flex space-x-2">
        <Button className="bg-fitBlue-600 hover:bg-fitBlue-700">
          <Bell className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Notificaciones</span>
        </Button>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Cliente</span>
        </Button>
      </div>
    </div>
  );
};
