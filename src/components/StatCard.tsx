import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  isLoading, 
  isError 
}: {
  title: string;
  value: number | undefined;
  description: string;
  icon: any;
  isLoading: boolean;
  isError: boolean;
}) => (
  <Card className="py-3 w-full hover:scale-105 transition-transform duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-muted-foreground">...</span>
          </div>
        ) : isError ? (
          <span className="text-red-500">--</span>
        ) : (
          value ?? 0
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);