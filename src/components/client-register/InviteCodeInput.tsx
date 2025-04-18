
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface InviteCodeInputProps {
  onSuccess: (trainerId: string) => void;
}

export const InviteCodeInput = ({ onSuccess }: InviteCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("Por favor ingresa un código de invitación");
      return;
    }

    try {
      setIsVerifying(true);
      
      const { data, error } = await supabase
        .from('trainer_invite_codes')
        .select('trainer_id, is_used')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !data) {
        toast.error("Código de invitación inválido");
        return;
      }

      if (data.is_used) {
        toast.error("Este código ya ha sido utilizado");
        return;
      }

      // Marcar el código como usado
      await supabase
        .from('trainer_invite_codes')
        .update({ is_used: true })
        .eq('code', code.toUpperCase());

      // Guardar el trainer_id sin eliminar otros datos importantes
      onSuccess(data.trainer_id);
      toast.success("Código verificado correctamente");
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error("Error al verificar el código");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inviteCode">Código de invitación</Label>
        <Input
          id="inviteCode"
          placeholder="Ingresa el código proporcionado por tu entrenador"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
      </div>
      <Button
        onClick={verifyCode}
        disabled={isVerifying}
        className="w-full"
      >
        {isVerifying ? "Verificando..." : "Verificar código"}
      </Button>
    </div>
  );
};
