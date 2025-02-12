
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  LineChart, Line, PieChart, Pie, ResponsiveContainer 
} from 'recharts';
import { DashboardWidget } from '../types';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ChartWidgetProps {
  widget: DashboardWidget;
  data: any[];
  onConfigChange?: (newConfig: any) => void;
  isEditable?: boolean;
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe',
  '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

export function ChartWidget({ 
  widget, 
  data, 
  onConfigChange,
  isEditable = false 
}: ChartWidgetProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [localConfig, setLocalConfig] = useState(widget.config);
  
  const chartHeight = useMemo(() => widget.position.h * 100, [widget.position.h]);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const renderChart = () => {
    switch (localConfig.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={localConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey={localConfig.yAxis} 
                fill={localConfig.color || CHART_COLORS[0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={localConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={localConfig.yAxis} 
                stroke={localConfig.color || CHART_COLORS[0]} 
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie 
                data={data} 
                dataKey={localConfig.value} 
                nameKey={localConfig.label} 
                fill={localConfig.color || CHART_COLORS[0]}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{widget.title}</CardTitle>
        {isEditable && (
          <Popover open={showConfig} onOpenChange={setShowConfig}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select
                    value={localConfig.chartType}
                    onValueChange={(value) => handleConfigChange('chartType', value)}
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {CHART_COLORS.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                        onClick={() => handleConfigChange('color', color)}
                      />
                    ))}
                  </div>
                </div>

                {localConfig.chartType !== 'pie' && (
                  <>
                    <div className="space-y-2">
                      <Label>X-Axis Field</Label>
                      <Input
                        value={localConfig.xAxis}
                        onChange={(e) => handleConfigChange('xAxis', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Y-Axis Field</Label>
                      <Input
                        value={localConfig.yAxis}
                        onChange={(e) => handleConfigChange('yAxis', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {localConfig.chartType === 'pie' && (
                  <>
                    <div className="space-y-2">
                      <Label>Value Field</Label>
                      <Input
                        value={localConfig.value}
                        onChange={(e) => handleConfigChange('value', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Label Field</Label>
                      <Input
                        value={localConfig.label}
                        onChange={(e) => handleConfigChange('label', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
