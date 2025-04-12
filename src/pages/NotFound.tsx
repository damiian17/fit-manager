
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Dumbbell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="flex justify-center">
          <div className="p-4 bg-fitBlue-100 rounded-full">
            <Dumbbell className="h-16 w-16 text-fitBlue-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-fitBlue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Página no encontrada</h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          Lo sentimos, la página que estás buscando no se encuentra disponible o ha sido movida.
        </p>
        
        <div className="flex justify-center pt-4">
          <Button asChild className="bg-fitBlue-600 hover:bg-fitBlue-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
