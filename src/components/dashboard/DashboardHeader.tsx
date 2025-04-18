import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, UserPlus } from "lucide-react";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import { supabase } from "@/integrations/supabase/client";
import { NotificationData } from "@/services/supabaseService";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      loadNotifications();
    }
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      const trainerId = session.user.id;
      
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
      
      const unread = data?.filter(n => n.status === 'pending').length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error in loadNotifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
      <div className="flex w-full sm:w-auto justify-end space-x-2">
        <div className="relative">
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-fitBlue-600 hover:bg-fitBlue-700" 
            onClick={toggleNotifications}
          >
            <Bell className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Notificaciones</span>}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          
          {showNotifications && (
            <NotificationsDropdown 
              notifications={notifications}
              isLoading={isLoading}
              onClose={() => setShowNotifications(false)}
              onRefresh={loadNotifications}
            />
          )}
        </div>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>
          <UserPlus className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Nuevo Cliente</span>}
        </Button>
      </div>
    </div>
  );
};
