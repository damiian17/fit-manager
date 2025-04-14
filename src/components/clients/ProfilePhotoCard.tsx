
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";

const ProfilePhotoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>
          Añade una foto de perfil del cliente (opcional)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <User className="h-20 w-20 text-gray-300" />
        </div>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Subir Imagen
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfilePhotoCard;
