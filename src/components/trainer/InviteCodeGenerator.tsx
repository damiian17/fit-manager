
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Copy } from "lucide-react";

export const InviteCodeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const generateInviteCode = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast.error("No se pudo identificar al entrenador");
        return;
      }

      const { data, error } = await supabase
        .rpc('create_trainer_invite_code', {
          trainer_id: session.user.id
        });

      if (error) throw error;
      
      setInviteCode(data);
      toast.success("Código de invitación generado correctamente");
    } catch (error) {
      console.error("Error generating invite code:", error);
      toast.error("Error al generar el código de invitación");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado al portapapeles");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Error al copiar el código");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitar Cliente</CardTitle>
        <CardDescription>
          Genera un código de invitación para que tus clientes se registren y queden vinculados a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {inviteCode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-mono text-lg">{inviteCode}</span>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="w-full"
              onClick={generateInviteCode}
              disabled={isLoading}
            >
              Generar nuevo código
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full"
            onClick={generateInviteCode}
            disabled={isLoading}
          >
            {isLoading ? "Generando..." : "Generar código de invitación"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
