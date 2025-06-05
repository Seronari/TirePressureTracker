export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  carModel?: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface Visit {
  id: number;
  date: string;
  page: string;
  source?: string;
}

export interface TrafficSource {
  source: string;
  percentage: number;
}

export interface PopularPage {
  page: string;
  count: number;
}
