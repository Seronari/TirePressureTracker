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
    // Initialize with default admin user
    this.users.push({
      id: this.nextUserId++,
      username: "admin",
      password: "$2b$10$8K1p/a0dhrxSHxHmy4q/h.uN7.1l.JX9.S8D7SJXE4E.9E1.E4E4E", // "admin123"
      isAdmin: true
    });

    // Add some sample content
    this.contents.push(
      {
        id: this.nextContentId++,
        key: "hero_title",
        section: "hero",
        title_ru: "Профессиональные TPMS датчики",
        title_kk: "Кәсіби TPMS датчиктері",
        content_ru: "Высококачественные датчики давления шин для вашего автомобиля",
        content_kk: "Сіздің автомобиліңіз үшін жоғары сапалы дөңгелек қысымы датчиктері",
        order: 1,
        isVisible: true,
        contentType: "text",
        cssClasses: null,
        metadata: null,
        updatedAt: new Date()
      }
    );
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
      username: insertUser.username,
      password: insertUser.password,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.push(user);
    return user;
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const inquiry: Inquiry = {
      id: this.nextInquiryId++,
      name: insertInquiry.name,
      phone: insertInquiry.phone,
      email: insertInquiry.email || null,
      carModel: insertInquiry.carModel || null,
      message: insertInquiry.message || null,
      status: "new",
      createdAt: new Date()
    };
    this.inquiries.push(inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return [...this.inquiries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    if (!since) return this.inquiries.length;
    return this.inquiries.filter(i => new Date(i.createdAt) >= since).length;
  }

  // Analytics methods
  async recordVisit(insertVisit: InsertVisit): Promise<Visit> {
    const visit: Visit = {
      id: this.nextVisitId++,
      date: new Date(),
      page: insertVisit.page,
      source: insertVisit.source || null
    };
    this.visits.push(visit);
    return visit;
  }

  async getVisitsCount(since?: Date): Promise<number> {
    if (!since) return this.visits.length;
    return this.visits.filter(v => new Date(v.date) >= since).length;
  }

  async getTrafficSourcesBreakdown(): Promise<Array<{source: string, percentage: number}>> {
    const totalVisits = this.visits.length;
    if (totalVisits === 0) return [];

    const sourceCounts = this.visits.reduce((acc, visit) => {
      const source = visit.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      percentage: Math.round((count / totalVisits) * 100)
    }));
  }

  async getPopularPages(): Promise<Array<{page: string, count: number}>> {
    const pageCounts = this.visits.reduce((acc, visit) => {
      acc[visit.page] = (acc[visit.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getVisitsOverTime(since: Date): Promise<Array<{date: string, count: number}>> {
    const filteredVisits = this.visits.filter(v => new Date(v.date) >= since);
    
    const dateCounts = filteredVisits.reduce((acc, visit) => {
      const dateStr = new Date(visit.date).toISOString().split('T')[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Content methods
  async getAllContents(): Promise<Content[]> {
    return [...this.contents].sort((a, b) => {
      if (a.section !== b.section) {
        return a.section.localeCompare(b.section);
      }
      return a.order - b.order;
    });
  }

  async getContentsBySection(section: string): Promise<Content[]> {
    return this.contents
      .filter(c => c.section === section)
      .sort((a, b) => a.order - b.order);
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.find(c => c.id === id);
  }

  async getContentByKey(key: string): Promise<Content | undefined> {
    return this.contents.find(c => c.key === key);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const content: Content = {
      id: this.nextContentId++,
      key: insertContent.key,
      section: insertContent.section,
      title_ru: insertContent.title_ru || null,
      title_kk: insertContent.title_kk || null,
      content_ru: insertContent.content_ru || null,
      content_kk: insertContent.content_kk || null,
      order: insertContent.order,
      isVisible: insertContent.isVisible !== undefined ? insertContent.isVisible : true,
      contentType: insertContent.contentType || "text",
      cssClasses: insertContent.cssClasses || null,
      metadata: insertContent.metadata || null,
      updatedAt: new Date()
    };
    this.contents.push(content);
    return content;
  }

  async updateContent(id: number, updateContent: UpdateContent): Promise<Content | undefined> {
    const content = this.contents.find(c => c.id === id);
    if (content) {
      Object.assign(content, updateContent, { updatedAt: new Date() });
    }
    return content;
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