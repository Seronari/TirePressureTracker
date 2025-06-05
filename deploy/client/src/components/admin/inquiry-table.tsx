import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Inquiry } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiRequest } from '@/lib/queryClient';

export function InquiryTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries'],
    queryFn: async () => {
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      return response.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/inquiries/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    }
  });

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return t('admin.inquiries.statusNew');
      case 'processing':
        return t('admin.inquiries.statusProcessing');
      case 'completed':
        return t('admin.inquiries.statusCompleted');
      default:
        return status;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-secondary font-condensed">
            {t('admin.inquiries.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.inquiries.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <p className="text-mid-gray">{t('admin.loading')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.inquiries.name')}</TableHead>
                    <TableHead>{t('admin.inquiries.contacts')}</TableHead>
                    <TableHead>{t('admin.inquiries.carModel')}</TableHead>
                    <TableHead>{t('admin.inquiries.date')}</TableHead>
                    <TableHead>{t('admin.inquiries.status')}</TableHead>
                    <TableHead>{t('admin.inquiries.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries?.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>
                        <div>{inquiry.phone}</div>
                        <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                      </TableCell>
                      <TableCell>{inquiry.carModel || '-'}</TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {getStatusLabel(inquiry.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">{t('admin.inquiries.view')}</span>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t('admin.inquiries.actions')}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(inquiry.id, 'new')}
                                disabled={inquiry.status === 'new'}
                              >
                                {t('admin.inquiries.markAsNew')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(inquiry.id, 'processing')}
                                disabled={inquiry.status === 'processing'}
                              >
                                {t('admin.inquiries.markAsProcessing')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(inquiry.id, 'completed')}
                                disabled={inquiry.status === 'completed'}
                              >
                                {t('admin.inquiries.markAsCompleted')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Inquiry Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.inquiries.viewInquiry')}</DialogTitle>
            <DialogDescription>
              {t('admin.inquiries.inquiryDetails')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.name')}</h4>
                  <p>{selectedInquiry.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.date')}</h4>
                  <p>{formatDate(selectedInquiry.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.phone')}</h4>
                  <p>{selectedInquiry.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.email')}</h4>
                  <p>{selectedInquiry.email || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.carModel')}</h4>
                  <p>{selectedInquiry.carModel || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.status')}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusLabel(selectedInquiry.status)}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-1">{t('admin.inquiries.message')}</h4>
                <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
              
              <div className="flex justify-between pt-4">
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewDialogOpen(false)}
                  >
                    {t('admin.inquiries.close')}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const newStatus = selectedInquiry.status === 'new' ? 'processing' : 
                                      selectedInquiry.status === 'processing' ? 'completed' : 'new';
                      handleUpdateStatus(selectedInquiry.id, newStatus);
                    }}
                  >
                    {selectedInquiry.status === 'new' ? t('admin.inquiries.markAsProcessing') : 
                     selectedInquiry.status === 'processing' ? t('admin.inquiries.markAsCompleted') : 
                     t('admin.inquiries.markAsNew')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
