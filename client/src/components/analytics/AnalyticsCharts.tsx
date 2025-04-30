import { useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';
import { PRIORITY_LABELS } from '@/lib/constants';
import { Issue } from '@shared/schema';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

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

interface TrendChartProps {
  issues: Issue[];
  isLoading: boolean;
  isError: boolean;
}

export const TrendChart = ({ issues, isLoading, isError }: TrendChartProps) => {
  const aggregatedData = useMemo(() => {
    if (!issues || issues.length === 0) {
      return [];
    }

    const weeklyData: Record<string, { newIssues: number; resolvedIssues: number }> = {};
    issues.forEach((issue) => {
      const createdWeek = format(new Date(issue.createdAt), "yyyy-'W'ww");
      const resolvedWeek = issue.updatedAt && (issue.status === 'closed') ? format(new Date(issue.updatedAt), "yyyy-'W'ww") : null;

      // New issues
      if (!weeklyData[createdWeek]) {
        weeklyData[createdWeek] = { newIssues: 0, resolvedIssues: 0 };
      }
      weeklyData[createdWeek].newIssues++;

      // Resolved issues
      if (resolvedWeek) {
        if (!weeklyData[resolvedWeek]) {
          weeklyData[resolvedWeek] = { newIssues: 0, resolvedIssues: 0 };
        }
        weeklyData[resolvedWeek].resolvedIssues++;
      }
    });

    return Object.entries(weeklyData).map(([week, counts]) => ({
      week,
      ...counts,
    }))
    .sort((a, b) => a.week.localeCompare(b.week)); // Sort by week in ascending order;
  }, [issues]);
  
    if (isLoading) {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Issue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Loading...</div>
          </CardContent>
        </Card>
      );
    }
  
    if (isError) {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Issue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Error fetching data.</div>
          </CardContent>
        </Card>
      );
    }
  
    if (!aggregatedData || aggregatedData.length === 0) {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Issue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div>No data available for Issue Trends</div>
          </CardContent>
        </Card>
      );
    }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Issue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newIssues" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="resolvedIssues" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        {/* <Chart
      type: 'line',
      data: {
        labels: aggregatedData.map(item => item.week),
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
    /> */}
      </CardContent>
    </Card>
  );
  };
  
interface ResolutionTimeChartProps {
  issues: Issue[];
}

export const ResolutionTimeChart = ({ issues }: ResolutionTimeChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const aggregatedData = useMemo(() => {
    if (!issues || issues.length === 0) {
      return [];
    }

    const categoryData: Record<string, { totalTime: number; count: number }> = {};
    const categories = new Set<string>();

    issues.forEach((issue) => {
      categories.add(issue.category);

      if (issue.updatedAt && (issue.status === 'closed')) {
        const resolvedDate = new Date(issue.updatedAt);
        const createdDate = new Date(issue.createdAt);
        const resolutionTime =
          (resolvedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24); // Time in days

        if (!categoryData[issue.category]) {
          categoryData[issue.category] = { totalTime: 0, count: 0 };
        }
        categoryData[issue.category].totalTime += resolutionTime;
        categoryData[issue.category].count++;
      }
    });

    const formattedData = Object.entries(categoryData).map(([category, data]) => {
      const avgTime = data.count > 0 ? data.totalTime / data.count : 0;
      return {
        category,
        avgResolutionTime: avgTime.toFixed(1),
      };
    });

    return formattedData;
  }, [issues]);

  useEffect(() => {

    if (!chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();
    
    const labels = aggregatedData.map(item => item.category);
    const data = aggregatedData.map(item => item.avgResolutionTime);
    
    const categoryColors = [
      'rgba(255, 99, 132, 0.7)',   // red
      'rgba(54, 162, 235, 0.7)',  // blue
      'rgba(255, 206, 86, 0.7)',  // yellow
      'rgba(75, 192, 192, 0.7)',  // green
      'rgba(153, 102, 255, 0.7)', // purple
      'rgba(255, 159, 64, 0.7)'   // orange
    ];
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: "Average Resolution Time (days)",
            data,
            backgroundColor: categoryColors,
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
  }, [aggregatedData]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Resolution Time Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

interface SprintIssuesChartProps {
  issues: Issue[];
}

export const SprintIssuesChart = ({ issues }: SprintIssuesChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const aggregatedData = useMemo(() => {
    if (!issues || issues.length === 0) {
      return [];
    }

    const sprintData: Record<string, { count: number }> = {};
    const sprints = new Set<string>();

    issues.forEach((issue) => {
      sprints.add(issue.sprint);

      if (issue.updatedAt && (issue.status === 'closed')) {
        if (!sprintData[issue.sprint]) {
          sprintData[issue.sprint] = { count: 0 };
        }
        sprintData[issue.sprint].count++;
      }
    });

    const formattedData = Object.entries(sprintData).map(([sprint, data]) => {
      return {
        sprint,
        numberOfIssues: data.count,
      };
    });

    return formattedData;
  }, [issues]);

  useEffect(() => {

    if (!chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();
    
    const labels = aggregatedData.map(item => item.sprint);
    const data = aggregatedData.map(item => item.numberOfIssues);
    
    const sprintColors = [
      'rgba(255, 99, 132, 0.7)',   // red
      'rgba(54, 162, 235, 0.7)',  // blue
      'rgba(255, 206, 86, 0.7)',  // yellow
      'rgba(75, 192, 192, 0.7)',  // green
      'rgba(153, 102, 255, 0.7)', // purple
      'rgba(255, 159, 64, 0.7)'   // orange
    ];
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of Issues",
            data: data,
            backgroundColor: sprintColors,
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
          },
          title: {
            display: true,
            text: 'Number of Issues by Sprint',
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
              text: 'Count'
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
  }, [aggregatedData]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sprint-Wise Issue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};
