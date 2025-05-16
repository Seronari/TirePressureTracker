import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: string;
}

export function StatsCard({ title, value, description, icon: Icon, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-secondary">{title}</h3>
          <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-primary mb-1">{value}</p>
        <p className="text-mid-gray text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
