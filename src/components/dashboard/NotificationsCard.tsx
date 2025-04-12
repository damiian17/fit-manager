
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Notification type
interface NotificationData {
  id: number;
  text: string;
  date: string;
}

interface NotificationsCardProps {
  notifications: NotificationData[];
}

export const NotificationsCard = ({ notifications }: NotificationsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>
          Actualizaciones recientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <p className="text-sm">{notification.text}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
