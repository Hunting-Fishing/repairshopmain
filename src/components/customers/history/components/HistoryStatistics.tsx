
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type HistoryStatisticsProps } from "../types";

export function HistoryStatistics({ statistics }: HistoryStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Changes by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(statistics.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Most Changed Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(statistics.byField)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([field, count]) => (
                <div key={field} className="flex justify-between items-center">
                  <span className="capitalize">{field.replace(/_/g, " ")}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
