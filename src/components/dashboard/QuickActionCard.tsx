
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
    <Link to={to} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardContent className="flex flex-col items-center justify-between p-6 h-full">
          <div className="flex flex-col items-center">
            {icon}
            <h3 className="text-lg font-semibold text-center">{title}</h3>
            <p className="text-sm text-gray-500 text-center mt-2 max-w-[14rem]">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
