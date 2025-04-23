import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';
import { PRIORITY_LABELS } from '@/lib/constants';

Chart.register(...registerables);

interface PriorityChartProps {
  data: Record<string, number>;
  timeRange: string;
}

export const PriorityChart = ({ data, timeRange }: PriorityChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const priorityLabels = Object.keys(data).map(key => PRIORITY_LABELS[key as keyof typeof PRIORITY_LABELS]);
    const priorityCounts = Object.values(data);
    const priorityColors = [
      'rgba(244, 67, 54, 0.7)', // high (red)
      'rgba(255, 152, 0, 0.7)', // medium (orange)
      'rgba(33, 150, 243, 0.7)', // low (blue)
    ];
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: priorityLabels,
        datasets: [{
          data: priorityCounts,
          backgroundColor: priorityColors,
          borderColor: 'white',
          borderWidth: 1,
          hoverOffset: 4
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
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Issues by Priority',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = priorityCounts.reduce((a, b) => a + b, 0);
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Issues by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export const TrendChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Mock data - in a real app, this would come from the API
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    const openData = [5, 8, 10, 14, 12, 9];
    const resolvedData = [3, 5, 8, 11, 13, 15];
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'New Issues',
            data: openData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3
          },
          {
            label: 'Resolved Issues',
            data: resolvedData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Issue Trends Over Time',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
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
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Issue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Note: This is sample data, which would be replaced with real trend data in production.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ResolutionTimeChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Mock data - in a real app, this would come from the API
    const labels = ['Bug', 'Feature', 'Documentation', 'Security', 'Performance'];
    const data = [3.2, 5.8, 1.9, 4.5, 2.7];
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Average Resolution Time (days)',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Average Resolution Time by Category',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Days'
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
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Resolution Time Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Note: This is sample data, which would be replaced with real resolution time data in production.</p>
        </div>
      </CardContent>
    </Card>
  );
};
