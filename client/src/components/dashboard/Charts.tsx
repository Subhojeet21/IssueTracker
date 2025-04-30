import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chart, registerables } from 'chart.js';
import { STATUS_LABELS, CATEGORY_LABELS } from '@/lib/constants';

Chart.register(...registerables);

interface StatusChartProps {
  data: Record<string, number>;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export const StatusChart = ({ data, timeRange, onTimeRangeChange }: StatusChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const statusLabels = Object.keys(data).map(key => STATUS_LABELS[key as keyof typeof STATUS_LABELS]);
    const statusCounts = Object.values(data);
    const statusColors = [
      'rgba(244, 67, 54, 0.7)', // red for open
      'rgba(255, 152, 0, 0.7)', // orange for in_progress
      'rgba(76, 175, 80, 0.7)', // green for resolved
      'rgba(158, 158, 158, 0.7)' // gray for closed
    ];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusCounts,
          backgroundColor: statusColors,
          borderColor: 'white',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              generateLabels: function(chart) {
                return chart.data.datasets[0]?.data.map((value, index) => ({
                  text: `${chart.data.labels?.[index] || ''}: ${value}`,
                  fillStyle: Array.isArray(chart.data.datasets[0].backgroundColor) 
                    ? chart.data.datasets[0].backgroundColor[index] 
                    : chart.data.datasets[0].backgroundColor
                }));              
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = statusCounts.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Issues by Status</CardTitle>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

interface CategoryChartProps {
  data: Record<string, number>;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export const CategoryChart = ({ data, timeRange, onTimeRangeChange }: CategoryChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const categoryLabels = Object.keys(data).map(key => CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS]);
    const categoryCounts = Object.values(data);
    const categoryColors = [
      'rgba(244, 67, 54, 0.7)', // red for bug
      'rgba(33, 150, 243, 0.7)', // blue for feature
      'rgba(156, 39, 176, 0.7)', // purple for documentation
      'rgba(255, 152, 0, 0.7)', // orange for security
      'rgba(76, 175, 80, 0.7)' // green for performance
    ];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: categoryLabels,
        datasets: [{
          label: 'Number of Issues',
          data: categoryCounts,
          backgroundColor: categoryColors,
          borderColor: categoryColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            title: {
              display: true,
              text: 'Count'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              generateLabels: function(chart) {
                return chart.data.datasets[0]?.data.map((value, index) => ({
                  text: `${chart.data.labels?.[index] || ''}: ${value}`,
                  fillStyle: Array.isArray(chart.data.datasets[0].backgroundColor) 
                    ? chart.data.datasets[0].backgroundColor[index] 
                    : chart.data.datasets[0].backgroundColor
                }));              
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Issues by Category</CardTitle>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};