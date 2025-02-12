
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie } from 'recharts';
import { DashboardWidget } from '../types';

interface ChartWidgetProps {
  widget: DashboardWidget;
  data: any[];
}

export function ChartWidget({ widget, data }: ChartWidgetProps) {
  const chartHeight = useMemo(() => widget.position.h * 100, [widget.position.h]);

  if (widget.config.chartType === 'bar') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: chartHeight }}>
            <BarChart width={400} height={chartHeight} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxis} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={widget.config.yAxis} fill="#8884d8" />
            </BarChart>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (widget.config.chartType === 'line') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: chartHeight }}>
            <LineChart width={400} height={chartHeight} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxis} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={widget.config.yAxis} stroke="#8884d8" />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (widget.config.chartType === 'pie') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: chartHeight }}>
            <PieChart width={400} height={chartHeight}>
              <Pie data={data} dataKey={widget.config.value} nameKey={widget.config.label} />
              <Tooltip />
            </PieChart>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
