
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

export const QuickActionCard = ({ icon, title, description, to }: QuickActionCardProps) => {
  return (
    <Link to={to}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
