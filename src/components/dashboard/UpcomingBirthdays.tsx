
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Birthday data type
interface BirthdayData {
  id: number;
  name: string;
  date: string;
}

interface UpcomingBirthdaysProps {
  birthdays: BirthdayData[];
}

export const UpcomingBirthdays = ({ birthdays }: UpcomingBirthdaysProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Próximos Cumpleaños</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {birthdays.map((client) => (
            <div key={client.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{client.name}</span>
              </div>
              <span className="text-xs bg-fitBlue-100 text-fitBlue-800 py-1 px-2 rounded-full">
                {client.date}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
