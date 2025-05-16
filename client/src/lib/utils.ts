import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getVisitDateRangeLabel(period: string): string {
  const today = new Date();
  
  if (period === '30days') {
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    return `${formatDate(startDate)} - ${formatDate(today)}`;
  }
  
  if (period === '3months') {
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 3);
    return `${formatDate(startDate)} - ${formatDate(today)}`;
  }
  
  if (period === 'year') {
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - 1);
    return `${formatDate(startDate)} - ${formatDate(today)}`;
  }
  
  return '';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-primary/10 text-primary';
    case 'processing':
      return 'bg-warning/10 text-warning';
    case 'completed':
      return 'bg-success/10 text-success';
    default:
      return 'bg-muted text-muted-foreground';
  }
}
