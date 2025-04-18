
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface InviteCodeInputProps {
  onSuccess: (trainerId: string) => void;
}

export const InviteCodeInput = ({ onSuccess }: InviteCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Limpiar cualquier sesión o datos que puedan estar causando problemas
  useEffect(() => {
    const cleanupStorageData = async () => {
      try {
        // Verificar si hay alguna sesión activa que pudiera estar causando conflictos
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Si no hay sesión activa, limpiar cualquier dato de localStorage que 
          // pudiera estar causando problemas con el registro
          const keysToRemove = [
            'sb-yehxlphlddyzrnewfelr-auth-token',
            'clientLoggedIn',
            'clientEmail',
            'clientUserId',
            'trainerLoggedIn',
            'trainerEmail',
            'trainerName'
          ];
          
          keysToRemove.forEach(key => localStorage.removeItem(key));
          console.log("Datos de sesión local limpiados preventivamente");
        }
      } catch (error) {
        console.error("Error al verificar/limpiar datos de sesión:", error);
      }
    };
    
    cleanupStorageData();
  }, []);

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
