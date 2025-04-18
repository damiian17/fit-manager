
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotificationData } from "@/services/supabaseService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NotificationsDropdownProps {
  notifications: NotificationData[];
  isLoading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationsDropdown = ({
  notifications,
  isLoading,
  onClose,
  onRefresh
}: NotificationsDropdownProps) => {
  const navigate = useNavigate();
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, HH:mm", { locale: es });
    } catch (error) {
      return "Fecha desconocida";
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMarkAsRead = async (notification: NotificationData) => {
    try {
      setProcessingIds(prev => [...prev, notification.id]);
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notification.id);

      if (error) {
        console.error("Error updating notification:", error);
        toast.error("Error al marcar como leída");
        return;
      }
      
      toast.success("Notificación marcada como leída");
      onRefresh();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== notification.id));
    }
  };

  const handleView = (notification: NotificationData) => {
    // Navigate to the appropriate page based on notification type
    if (notification.type === 'diet') {
      navigate(`/diets?view=${notification.item_id}`);
    } else if (notification.type === 'workout') {
      navigate(`/workouts?view=${notification.item_id}`);
    }
    handleMarkAsRead(notification);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 flex justify-center" 
      onClick={handleOutsideClick}
    >
      <Card className="absolute right-0 top-16 w-80 sm:w-96 max-h-[80vh] overflow-auto shadow-lg">
        <CardContent className="p-0">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Notificaciones</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="sr-only">Actualizar</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={onClose}
              >
                <span className="sr-only">Cerrar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-b p-3 hover:bg-gray-50 transition-colors ${notification.status === 'pending' ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {notification.client_name} ha solicitado un cambio en {" "}
                        {notification.type === 'diet' ? 'la dieta' : 'la rutina'}: {notification.item_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleView(notification)}
                        className="h-8 w-8 p-0"
                        disabled={processingIds.includes(notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(notification)}
                        className="h-8 w-8 p-0"
                        disabled={processingIds.includes(notification.id) || notification.status === 'read'}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Marcar como leído</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{notification.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No hay notificaciones nuevas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
