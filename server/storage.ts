import { 
  users, 
  inquiries, 
  visits, 
  type User, 
  type Inquiry, 
  type Visit, 
  type InsertUser, 
  type InsertInquiry, 
  type InsertVisit 
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Inquiry management
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined>;
  getInquiriesCount(since?: Date): Promise<number>;
  
  // Analytics
  recordVisit(visit: InsertVisit): Promise<Visit>;
  getVisitsCount(since?: Date): Promise<number>;
  getTrafficSourcesBreakdown(): Promise<Array<{source: string, percentage: number}>>;
  getPopularPages(): Promise<Array<{page: string, count: number}>>;
  getVisitsOverTime(since: Date): Promise<Array<{date: string, count: number}>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inquiries: Map<number, Inquiry>;
  private visits: Visit[];
  private userIdCounter: number;
  private inquiryIdCounter: number;
  private visitIdCounter: number;

  constructor() {
    this.users = new Map();
    this.inquiries = new Map();
    this.visits = [];
    this.userIdCounter = 1;
    this.inquiryIdCounter = 1;
    this.visitIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryIdCounter++;
    const createdAt = new Date();
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      status: "new", 
      createdAt 
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;

    const updatedInquiry = { ...inquiry, status };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  async getInquiriesCount(since?: Date): Promise<number> {
    if (!since) return this.inquiries.size;
    
    return Array.from(this.inquiries.values()).filter(
      inquiry => inquiry.createdAt >= since
    ).length;
  }

  // Analytics methods
  async recordVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = this.visitIdCounter++;
    const date = new Date();
    const visit: Visit = { ...insertVisit, id, date };
    this.visits.push(visit);
    return visit;
  }

  async getVisitsCount(since?: Date): Promise<number> {
    if (!since) return this.visits.length;
    
    return this.visits.filter(visit => visit.date >= since).length;
  }

  async getTrafficSourcesBreakdown(): Promise<Array<{source: string, percentage: number}>> {
    const sources = {
      search: 0,
      direct: 0,
      social: 0,
      other: 0
    };
    
    this.visits.forEach(visit => {
      if (visit.source === 'search') sources.search++;
      else if (visit.source === 'direct') sources.direct++;
      else if (visit.source === 'social') sources.social++;
      else sources.other++;
    });
    
    const total = this.visits.length || 1; // Avoid division by zero
    
    return [
      { source: 'search', percentage: Math.round((sources.search / total) * 100) },
      { source: 'direct', percentage: Math.round((sources.direct / total) * 100) },
      { source: 'social', percentage: Math.round((sources.social / total) * 100) },
      { source: 'other', percentage: Math.round((sources.other / total) * 100) }
    ];
  }

  async getPopularPages(): Promise<Array<{page: string, count: number}>> {
    const pages: Record<string, number> = {};
    
    this.visits.forEach(visit => {
      pages[visit.page] = (pages[visit.page] || 0) + 1;
    });
    
    return Object.entries(pages)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  async getVisitsOverTime(since: Date): Promise<Array<{date: string, count: number}>> {
    const dateMap: Record<string, number> = {};
    
    // Filter visits that are after the since date
    const filteredVisits = this.visits.filter(visit => visit.date >= since);
    
    // Group visits by date
    filteredVisits.forEach(visit => {
      const dateStr = visit.date.toISOString().split('T')[0];
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });
    
    // Fill in missing dates with zero counts
    const result: Array<{date: string, count: number}> = [];
    const currentDate = new Date(since);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: dateMap[dateStr] || 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  }
}

export const storage = new MemStorage();

// Seed some initial data
(async () => {
  // Record some visits
  const pages = ['/', '/products', '/services', '/contact'];
  const sources = ['search', 'direct', 'social', 'other'];
  
  // Create 100 random visits over the last 30 days
  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    await storage.recordVisit({
      page: pages[Math.floor(Math.random() * pages.length)],
      source: sources[Math.floor(Math.random() * sources.length)]
    });
  }
})();
