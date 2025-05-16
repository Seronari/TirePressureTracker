import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { StatsCard } from '@/components/admin/stats-card';
import { VisitsChart } from '@/components/admin/chart';
import { TrafficSources } from '@/components/admin/traffic-sources';
import { InquiryTable } from '@/components/admin/inquiry-table';
import { ClipboardList, Users, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsSummary {
  totalVisits: number;
  newInquiries: number;
  conversionRate: string;
}

interface PopularPage {
  page: string;
  count: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [chartPeriod, setChartPeriod] = useState('30days');

  const { data: summary, isLoading: summaryLoading } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/summary');
      if (!response.ok) throw new Error('Failed to fetch analytics summary');
      return response.json();
    }
  });

  const { data: popularPages, isLoading: pagesLoading } = useQuery<PopularPage[]>({
    queryKey: ['/api/analytics/popular-pages'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/popular-pages');
      if (!response.ok) throw new Error('Failed to fetch popular pages');
      return response.json();
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('admin.dashboard.logoutSuccess'),
        description: t('admin.dashboard.logoutMessage'),
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: t('admin.dashboard.logoutError'),
        description: t('admin.dashboard.logoutErrorMessage'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold font-condensed">
                TPMS<span className="text-accent">Pro</span> <span className="text-sm ml-2">| {t('admin.dashboard.title')}</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block text-sm">{user?.username}</span>
              <Button variant="ghost" className="text-white hover:text-accent" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="hidden md:inline-block ml-1">{t('admin.dashboard.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-secondary font-condensed">{t('admin.dashboard.controlPanel')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title={t('admin.dashboard.inquiries')}
            value={summary?.newInquiries || 0}
            description={t('admin.dashboard.newInquiriesDesc')}
            icon={ClipboardList}
            color="bg-primary/10 text-primary"
          />
          
          <StatsCard
            title={t('admin.dashboard.visits')}
            value={summary?.totalVisits || 0}
            description={t('admin.dashboard.visitsDesc')}
            icon={Users}
            color="bg-success/10 text-success"
          />
          
          <StatsCard
            title={t('admin.dashboard.conversion')}
            value={`${summary?.conversionRate || 0}%`}
            description={t('admin.dashboard.conversionDesc')}
            icon={PieChart}
            color="bg-warning/10 text-warning"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <VisitsChart 
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
            />
          </div>
          
          <div className="space-y-8">
            <TrafficSources />
            
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-secondary font-condensed">
                  {t('admin.dashboard.popularPages')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {pagesLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-mid-gray">{t('admin.loading')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {popularPages?.map((page) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-secondary">
                            {page.page === '/' ? t('admin.dashboard.homePage') : 
                             page.page === '/products' ? t('admin.dashboard.productsPage') :
                             page.page === '/services' ? t('admin.dashboard.servicesPage') :
                             page.page === '/contact' ? t('admin.dashboard.contactPage') :
                             page.page}
                          </p>
                          <p className="text-sm text-mid-gray">{page.page}</p>
                        </div>
                        <p className="font-bold text-primary">{page.count}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8">
          <InquiryTable />
        </div>
      </main>
    </div>
  );
}
