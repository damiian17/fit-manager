
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Edit, Check, X } from "lucide-react";
import { getActiveSession } from "@/utils/authUtils";
import { getTrainerInviteCode, updateTrainerInviteCode } from "@/services/supabaseService";

export const InviteCodeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [inputCode, setInputCode] = useState<string>("");

  useEffect(() => {
    const fetchInviteCode = async () => {
      setIsLoading(true);
      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session?.user?.id) {
          toast.error("No se pudo identificar al entrenador");
          setIsLoading(false);
          return;
        }
        const code = await getTrainerInviteCode(session.user.id);
        if (code) {
          setInviteCode(code);
          setInputCode(code);
        } else {
          // Si no hay código, se puede crear uno nuevo automáticamente (opcional)
          // const newCode = await createTrainerInviteCodeIfNotExists(session.user.id);
          // if(newCode) {
          //   setInviteCode(newCode);
          //   setInputCode(newCode);
          // }
        }
      } catch (error) {
        console.error("Error loading invite code:", error);
        toast.error("Error al cargar el código de invitación");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteCode();
  }, []);

  const saveNewCode = async () => {
    if (!inputCode.trim()) {
      toast.error("El código no puede estar vacío");
      return;
    }
    setIsLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session?.user?.id) {
        toast.error("No se pudo identificar al entrenador");
        setIsLoading(false);
        return;
      }
      await updateTrainerInviteCode(session.user.id, inputCode.trim());
      setInviteCode(inputCode.trim().toUpperCase());
      toast.success("Código de invitación actualizado correctamente");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating invite code:", error);
      toast.error("Error al actualizar el código de invitación");
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
          El código que compartas aquí será el código fijo para tus clientes, ellos usarán este código para vincularse a tu cuenta. Puedes editarlo cuando quieras.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {inviteCode && !editMode && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-mono text-lg">{inviteCode}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {(editMode || !inviteCode) && (
          <div className="flex gap-2">
            <input
              className="flex-grow bg-muted rounded-md border border-input px-3 py-2 font-mono text-lg uppercase"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              disabled={isLoading}
              maxLength={20}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={saveNewCode}
              disabled={isLoading || !inputCode.trim()}
              title="Guardar código"
            >
              <Check className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputCode(inviteCode);
                setEditMode(false);
              }}
              title="Cancelar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {!inviteCode && !editMode && !isLoading && (
          <Button 
            className="w-full"
            onClick={() => setEditMode(true)}
          >
            Crear Código de Invitación
          </Button>
        )}
        {isLoading && !editMode && (
          <div className="text-center text-sm text-muted-foreground">Cargando...</div>
        )}
      </CardContent>
    </Card>
  );
};
