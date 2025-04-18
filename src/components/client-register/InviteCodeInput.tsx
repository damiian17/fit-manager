
// Actualizamos InviteCodeInput para eliminar la verificación de expiración del código

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/utils/authUtils";

interface InviteCodeInputProps {
  onSuccess: (trainerId: string) => void;
}

export const InviteCodeInput = ({ onSuccess }: InviteCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("Por favor ingresa un código de invitación");
      return;
    }

    try {
      setIsVerifying(true);

      console.log("Verificando código:", code.toUpperCase());

      const { data, error } = await supabase
        .from('trainer_invite_codes')
        .select('trainer_id')
        .eq('code', code.toUpperCase())
        .single();

      console.log("Resultado de verificación:", { data, error });

      if (error || !data) {
        console.error("Error validating invite code:", error);
        toast.error("Código de invitación inválido");
        return;
      }

      // Ya no verificamos expiración ni is_used para permitir su uso ilimitado

      const { data: trainerData, error: trainerError } = await supabase
        .from('trainers')
        .select('name')
        .eq('id', data.trainer_id)
        .single();

      console.log("Datos del entrenador:", { trainerData, trainerError });

      if (trainerError || !trainerData) {
        console.error("Error validating trainer:", trainerError);
        toast.error("No se pudo verificar el entrenador asociado al código");
        return;
      }

      // No actualizamos is_used para que el código siga disponible para otros clientes
      // Esto permite reutilizar el código para múltiples clientes

      console.log("Código verificado correctamente para el entrenador:", trainerData.name);
      onSuccess(data.trainer_id);
      toast.success(`Código verificado correctamente. Te has conectado con el entrenador: ${trainerData.name}`);
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error("Error al verificar el código");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReturnToLogin = async () => {
    await signOut(navigate);
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
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={handleReturnToLogin}
          size="sm"
        >
          Volver a iniciar sesión
        </Button>
      </div>
    </div>
  );
};

