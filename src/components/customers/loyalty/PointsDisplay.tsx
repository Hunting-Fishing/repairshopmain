
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  tier: string;
}

export function PointsDisplay({ points, tier }: PointsDisplayProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold':
        return 'text-yellow-500';
      case 'silver':
        return 'text-gray-400';
      default:
        return 'text-amber-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Loyalty Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="text-3xl font-bold text-orange-500">{points}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="flex items-center gap-2">
            <Star className={`h-5 w-5 ${getTierColor(tier)}`} />
            <span className={`font-semibold capitalize ${getTierColor(tier)}`}>
              {tier} Tier
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
