import { 
  type User, 
  type Inquiry, 
  type Visit, 
  type Content,
  type InsertUser, 
  type InsertInquiry, 
  type InsertVisit,
  type InsertContent,
  type UpdateContent
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
  
  // Content Management
  getAllContents(): Promise<Content[]>;
  getContentsBySection(section: string): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  getContentByKey(key: string): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: UpdateContent): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
}

class MemStorage implements IStorage {
  private users: User[] = [];
  private inquiries: Inquiry[] = [];
  private visits: Visit[] = [];
  private contents: Content[] = [];
  private nextUserId = 1;
  private nextInquiryId = 1;
  private nextVisitId = 1;
  private nextContentId = 1;

  constructor() {
    // Create default admin user
    this.users.push({
      id: this.nextUserId++,
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser
    };
    this.users.push(user);
    return user;
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const inquiry: Inquiry = {
      id: this.nextInquiryId++,
      ...insertInquiry,
      status: "new",
      createdAt: new Date()
    };
    this.inquiries.push(inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return [...this.inquiries].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.find(i => i.id === id);
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.find(i => i.id === id);
    if (inquiry) {
      inquiry.status = status;
    }
    return inquiry;
  }

  async getInquiriesCount(since?: Date): Promise<number> {
    if (since) {
      return this.inquiries.filter(i => i.createdAt >= since).length;
    }
    return this.inquiries.length;
  }

  // Analytics methods
  async recordVisit(insertVisit: InsertVisit): Promise<Visit> {
    const visit: Visit = {
      id: this.nextVisitId++,
      ...insertVisit,
      date: new Date()
    };
    this.visits.push(visit);
    return visit;
  }

  async getVisitsCount(since?: Date): Promise<number> {
    if (since) {
      return this.visits.filter(v => v.date >= since).length;
    }
    return this.visits.length;
  }

  async getTrafficSourcesBreakdown(): Promise<Array<{source: string, percentage: number}>> {
    const sourceMap = new Map<string, number>();
    this.visits.forEach(visit => {
      const source = visit.source || 'direct';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    const total = this.visits.length || 1;
    return Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      percentage: Math.round((count / total) * 100)
    }));
  }

  async getPopularPages(): Promise<Array<{page: string, count: number}>> {
    const pageMap = new Map<string, number>();
    this.visits.forEach(visit => {
      pageMap.set(visit.page, (pageMap.get(visit.page) || 0) + 1);
    });

    return Array.from(pageMap.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  async getVisitsOverTime(since: Date): Promise<Array<{date: string, count: number}>> {
    const dateMap = new Map<string, number>();
    this.visits
      .filter(v => v.date >= since)
      .forEach(visit => {
        const dateStr = visit.date.toISOString().split('T')[0];
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      });

    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Content Management methods
  async getAllContents(): Promise<Content[]> {
    return [...this.contents].sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return (a.order || 0) - (b.order || 0);
    });
  }

  async getContentsBySection(section: string): Promise<Content[]> {
    return this.contents
      .filter(c => c.section === section)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.find(c => c.id === id);
  }

  async getContentByKey(key: string): Promise<Content | undefined> {
    return this.contents.find(c => c.key === key);
  }

  async createContent(content: InsertContent): Promise<Content> {
    const newContent: Content = {
      id: this.nextContentId++,
      ...content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contents.push(newContent);
    return newContent;
  }

  async updateContent(id: number, content: UpdateContent): Promise<Content | undefined> {
    const existing = this.contents.find(c => c.id === id);
    if (existing) {
      Object.assign(existing, content, { updatedAt: new Date() });
    }
    return existing;
  }

  async deleteContent(id: number): Promise<boolean> {
    const index = this.contents.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contents.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();