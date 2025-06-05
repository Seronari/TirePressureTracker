import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

interface TrafficSource {
  source: string;
  percentage: number;
}

export function TrafficSources() {
  const { t } = useTranslation();

  const { data: sources, isLoading } = useQuery<TrafficSource[]>({
    queryKey: ['/api/analytics/traffic-sources'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/traffic-sources');
      if (!response.ok) throw new Error('Failed to fetch traffic sources');
      return response.json();
    }
  });

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'search':
        return 'bg-primary';
      case 'direct':
        return 'bg-success';
      case 'social':
        return 'bg-warning';
      case 'other':
        return 'bg-accent';
      default:
        return 'bg-muted';
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'search':
        return t('admin.trafficSources.search');
      case 'direct':
        return t('admin.trafficSources.direct');
      case 'social':
        return t('admin.trafficSources.social');
      case 'other':
        return t('admin.trafficSources.other');
      default:
        return source;
    }
  };

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-bold text-secondary font-condensed">
          {t('admin.trafficSources.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-mid-gray">{t('admin.loading')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources?.map((source) => (
              <div key={source.source}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-dark-gray">{getSourceName(source.source)}</span>
                  <span className="text-sm font-bold text-secondary">{source.percentage}%</span>
                </div>
                <div className="w-full bg-light-gray rounded-full h-2">
                  <div 
                    className={`${getSourceColor(source.source)} h-2 rounded-full`} 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
