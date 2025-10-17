import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isPremium?: boolean;
}

export const FeatureCard = ({ icon: Icon, title, description, isPremium = false }: FeatureCardProps) => {
  const { toast } = useToast();

  const handleAction = () => {
    if (isPremium) {
      toast({
        title: "Premium Feature",
        description: "This feature is available in the premium plan. Upgrade to unlock!",
      });
    } else {
      toast({
        title: "Feature Coming Soon",
        description: "We're working hard to bring this feature to you!",
      });
    }
  };

  return (
    <Card className="h-full hover:shadow-medium transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isPremium ? "bg-accent/10" : "bg-primary/10"
          }`}>
            <Icon className={`h-5 w-5 ${isPremium ? "text-accent" : "text-primary"}`} />
          </div>
          {isPremium && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
              Premium
            </span>
          )}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={isPremium ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={handleAction}
        >
          {isPremium ? "Upgrade" : "Try Now"}
        </Button>
      </CardContent>
    </Card>
  );
};
