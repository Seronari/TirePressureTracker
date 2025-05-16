import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { getVisitDateRangeLabel } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VisitsChartProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

interface VisitData {
  date: string;
  count: number;
}

export function VisitsChart({ period, onPeriodChange }: VisitsChartProps) {
  const { t } = useTranslation();
  const chartRef = useRef<ChartJS>(null);

  const { data: visitsData, isLoading } = useQuery<VisitData[]>({
    queryKey: ['/api/analytics/visits-over-time', period],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`/api/analytics/visits-over-time?period=${queryKey[1]}`);
      if (!response.ok) throw new Error('Failed to fetch visits data');
      return response.json();
    }
  });

  const chartData: ChartData<'line'> = {
    labels: visitsData?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }) || [],
    datasets: [
      {
        label: t('admin.visitsChart.visits'),
        data: visitsData?.map(d => d.count) || [],
        fill: false,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'hsl(var(--primary))',
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <Card>
      <CardHeader className="p-6 flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold text-secondary font-condensed">
          {t('admin.visitsChart.title')}
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={period === '30days' ? "default" : "outline"} 
            size="sm"
            onClick={() => onPeriodChange('30days')}
          >
            {t('admin.visitsChart.30days')}
          </Button>
          <Button 
            variant={period === '3months' ? "default" : "outline"} 
            size="sm"
            onClick={() => onPeriodChange('3months')}
          >
            {t('admin.visitsChart.3months')}
          </Button>
          <Button 
            variant={period === 'year' ? "default" : "outline"} 
            size="sm"
            onClick={() => onPeriodChange('year')}
          >
            {t('admin.visitsChart.year')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-4">
          {getVisitDateRangeLabel(period)}
        </div>
        
        <div className="h-80">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-mid-gray">{t('admin.loading')}</p>
            </div>
          ) : (
            <Line 
              ref={chartRef}
              data={chartData} 
              options={chartOptions} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
