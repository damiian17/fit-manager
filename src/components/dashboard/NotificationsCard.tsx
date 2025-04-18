import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NotificationData } from "@/services/supabaseService";

interface NotificationsCardProps {
  trainerId?: string;
  onViewItem?: (notification: NotificationData) => void;
}

export const NotificationsCard = ({ trainerId, onViewItem }: NotificationsCardProps) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    if (!trainerId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error loading notifications:", error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("Error in loadNotifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (trainerId) {
      loadNotifications();
    }
  }, [trainerId]);

  const handleMarkAsRead = async (notification: NotificationData) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notification.id);

      if (error) {
        console.error("Error updating notification:", error);
        toast.error("Error al marcar la notificación como leída");
        return;
      }

      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? {...n, status: 'read'} : n
      ));
      
      toast.success("Notificación marcada como leída");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error al actualizar la notificación");
    }
  };

  const handleViewItem = (notification: NotificationData) => {
    if (onViewItem) {
      onViewItem(notification);
    }
    handleMarkAsRead(notification);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return "Fecha desconocida";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Solicitudes de cambios y actualizaciones
            </CardDescription>
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
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
                      onClick={() => handleViewItem(notification)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(notification)}
                      className="h-8 w-8 p-0"
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
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No hay notificaciones nuevas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
