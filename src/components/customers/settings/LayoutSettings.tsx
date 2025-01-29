import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Grid2X2, Columns2, Rows3, List, LayoutGrid } from "lucide-react";

interface LayoutSettingsProps {
  viewMode: string;
  setViewMode: (value: string) => void;
  columnsCount: string;
  setColumnsCount: (value: string) => void;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  cardSize: string;
  setCardSize: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function LayoutSettings({
  viewMode,
  setViewMode,
  columnsCount,
  setColumnsCount,
  showDetails,
  setShowDetails,
  cardSize,
  setCardSize,
  sortOrder,
  setSortOrder,
}: LayoutSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout Settings</CardTitle>
        <CardDescription>
          Customize how customer information is displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">View Mode</h3>
            <RadioGroup
              value={viewMode}
              onValueChange={setViewMode}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid" className="flex items-center gap-1">
                  <Grid2X2 className="h-4 w-4" /> Grid
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="columns" id="columns" />
                <Label htmlFor="columns" className="flex items-center gap-1">
                  <Columns2 className="h-4 w-4" /> Columns
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rows" id="rows" />
                <Label htmlFor="rows" className="flex items-center gap-1">
                  <Rows3 className="h-4 w-4" /> Rows
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list" className="flex items-center gap-1">
                  <List className="h-4 w-4" /> List
                </Label>
              </div>
            </RadioGroup>
          </div>

          {viewMode === "grid" && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Grid Columns</h3>
                <RadioGroup
                  value={columnsCount}
                  onValueChange={setColumnsCount}
                  className="flex gap-4"
                >
                  {["2", "3", "4"].map((count) => (
                    <div key={count} className="flex items-center space-x-2">
                      <RadioGroupItem value={count} id={`col-${count}`} />
                      <Label htmlFor={`col-${count}`}>{count} Columns</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Card Size</h3>
                <RadioGroup
                  value={cardSize}
                  onValueChange={setCardSize}
                  className="flex gap-4"
                >
                  {["compact", "normal", "large"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`} className="capitalize">
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Sort Order</h3>
            <RadioGroup
              value={sortOrder}
              onValueChange={setSortOrder}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="sort-name" />
                <Label htmlFor="sort-name">By Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="sort-recent" />
                <Label htmlFor="sort-recent">Most Recent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loyalty" id="sort-loyalty" />
                <Label htmlFor="sort-loyalty">Loyalty Tier</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-details">Show Details</Label>
              <p className="text-sm text-muted-foreground">
                Display additional customer information in cards
              </p>
            </div>
            <Switch
              id="show-details"
              checked={showDetails}
              onCheckedChange={setShowDetails}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}