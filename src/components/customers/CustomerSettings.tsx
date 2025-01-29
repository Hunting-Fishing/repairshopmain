import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart3, History, Layout, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function CustomerSettings() {
  const { toast } = useToast();
  const [tierSettings, setTierSettings] = useState({
    bronze: { min: 0, max: 1000 },
    silver: { min: 1001, max: 5000 },
    gold: { min: 5001, max: null }
  });
  const [pointsSettings, setPointsSettings] = useState({
    earning: { dollars: 1, points: 1 },
    redeeming: { points: 100, dollars: 5 }
  });

  const handleSaveSettings = () => {
    // TODO: Save settings to database
    toast({
      title: "Settings saved",
      description: "Your loyalty program settings have been updated."
    });
  };

  return (
    <Tabs defaultValue="loyalty" className="space-y-4">
      <TabsList>
        <TabsTrigger value="loyalty">
          <Award className="h-4 w-4 mr-2" />
          Loyalty Program
        </TabsTrigger>
        <TabsTrigger value="layout">
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-2" />
          History
        </TabsTrigger>
        <TabsTrigger value="reports">
          <BarChart3 className="h-4 w-4 mr-2" />
          Reports
        </TabsTrigger>
        <TabsTrigger value="referrals">
          <UserPlus className="h-4 w-4 mr-2" />
          Referrals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="loyalty">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Settings</CardTitle>
            <CardDescription>
              Configure your customer loyalty program settings and rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tier System</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <h4 className="font-medium">Bronze</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="bronze-min">Minimum Points</Label>
                      <Input
                        id="bronze-min"
                        type="number"
                        value={tierSettings.bronze.min}
                        onChange={(e) => setTierSettings(prev => ({
                          ...prev,
                          bronze: { ...prev.bronze, min: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bronze-max">Maximum Points</Label>
                      <Input
                        id="bronze-max"
                        type="number"
                        value={tierSettings.bronze.max}
                        onChange={(e) => setTierSettings(prev => ({
                          ...prev,
                          bronze: { ...prev.bronze, max: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Silver</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="silver-min">Minimum Points</Label>
                      <Input
                        id="silver-min"
                        type="number"
                        value={tierSettings.silver.min}
                        onChange={(e) => setTierSettings(prev => ({
                          ...prev,
                          silver: { ...prev.silver, min: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="silver-max">Maximum Points</Label>
                      <Input
                        id="silver-max"
                        type="number"
                        value={tierSettings.silver.max}
                        onChange={(e) => setTierSettings(prev => ({
                          ...prev,
                          silver: { ...prev.silver, max: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Gold</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="gold-min">Minimum Points</Label>
                      <Input
                        id="gold-min"
                        type="number"
                        value={tierSettings.gold.min}
                        onChange={(e) => setTierSettings(prev => ({
                          ...prev,
                          gold: { ...prev.gold, min: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Point System</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium">Earning Points</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <Label htmlFor="earning-dollars">$</Label>
                        <Input
                          id="earning-dollars"
                          type="number"
                          value={pointsSettings.earning.dollars}
                          onChange={(e) => setPointsSettings(prev => ({
                            ...prev,
                            earning: { ...prev.earning, dollars: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                      <span className="mt-8">=</span>
                      <div>
                        <Label htmlFor="earning-points">Points</Label>
                        <Input
                          id="earning-points"
                          type="number"
                          value={pointsSettings.earning.points}
                          onChange={(e) => setPointsSettings(prev => ({
                            ...prev,
                            earning: { ...prev.earning, points: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Redeeming Points</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <Label htmlFor="redeeming-points">Points</Label>
                        <Input
                          id="redeeming-points"
                          type="number"
                          value={pointsSettings.redeeming.points}
                          onChange={(e) => setPointsSettings(prev => ({
                            ...prev,
                            redeeming: { ...prev.redeeming, points: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                      <span className="mt-8">=</span>
                      <div>
                        <Label htmlFor="redeeming-dollars">$</Label>
                        <Input
                          id="redeeming-dollars"
                          type="number"
                          value={pointsSettings.redeeming.dollars}
                          onChange={(e) => setPointsSettings(prev => ({
                            ...prev,
                            redeeming: { ...prev.redeeming, dollars: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="layout">
        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
            <CardDescription>
              Customize how customer information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Layout settings coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Customer History</CardTitle>
            <CardDescription>
              View customer interaction history and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer history tracking coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reports</CardTitle>
            <CardDescription>
              Generate and view customer analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer reporting features coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referrals">
        <Card>
          <CardHeader>
            <CardTitle>Customer Referrals</CardTitle>
            <CardDescription>
              Track and manage customer referral programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Referral tracking system coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}