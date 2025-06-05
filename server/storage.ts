import { 
  users, 
  inquiries, 
  visits, 
  contents,
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
import { db } from "./db";
import { eq, gte, count, sql, desc, asc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const now = new Date();
    const [inquiry] = await db.insert(inquiries).values({
      ...insertInquiry,
      status: "new",
      createdAt: now
    }).returning();
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  async getInquiriesCount(since?: Date): Promise<number> {
    if (!since) {
      const [result] = await db.select({ value: count() }).from(inquiries);
      return result.value;
    }
    
    const [result] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(gte(inquiries.createdAt, since));
    return result.value;
  }

  // Analytics methods
  async recordVisit(insertVisit: InsertVisit): Promise<Visit> {
    const now = new Date();
    const [visit] = await db.insert(visits).values({
      ...insertVisit,
      date: now
    }).returning();
    return visit;
  }

  async getVisitsCount(since?: Date): Promise<number> {
    if (!since) {
      const [result] = await db.select({ value: count() }).from(visits);
      return result.value;
    }
    
    const [result] = await db
      .select({ value: count() })
      .from(visits)
      .where(gte(visits.date, since));
    return result.value;
  }

  async getTrafficSourcesBreakdown(): Promise<Array<{source: string, percentage: number}>> {
    // Get total count
    const [totalResult] = await db.select({ value: count() }).from(visits);
    const total = totalResult.value || 1; // Avoid division by zero
    
    // Get counts by source
    const sources = ['search', 'direct', 'social', 'other'];
    const result: Array<{source: string, percentage: number}> = [];
    
    for (const source of sources) {
      const [sourceCount] = await db
        .select({ value: count() })
        .from(visits)
        .where(eq(visits.source, source));
      
      const percentage = Math.round((sourceCount.value / total) * 100);
      result.push({ source, percentage });
    }
    
    return result;
  }

  async getPopularPages(): Promise<Array<{page: string, count: number}>> {
    const result = await db
      .select({
        page: visits.page,
        count: count(),
      })
      .from(visits)
      .groupBy(visits.page)
      .orderBy(desc(count()))
      .limit(5);
    
    return result;
  }

  async getVisitsOverTime(since: Date): Promise<Array<{date: string, count: number}>> {
    // Convert date to database format
    const result = await db
      .select({
        date: sql<string>`DATE(${visits.date})`,
        count: count(),
      })
      .from(visits)
      .where(gte(visits.date, since))
      .groupBy(sql`DATE(${visits.date})`)
      .orderBy(sql`DATE(${visits.date})`);
    
    // Create a complete date range with zero values for missing dates
    const dateMap: Record<string, number> = {};
    result.forEach(item => {
      dateMap[item.date] = item.count;
    });
    
    const completeResult: Array<{date: string, count: number}> = [];
    const currentDate = new Date(since);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      completeResult.push({
        date: dateStr,
        count: dateMap[dateStr] || 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return completeResult;
  }
  
  // Content Management methods
  async getAllContents(): Promise<Content[]> {
    return await db
      .select()
      .from(contents)
      .orderBy(asc(contents.section), asc(contents.order));
  }
  
  async getContentsBySection(section: string): Promise<Content[]> {
    return await db
      .select()
      .from(contents)
      .where(eq(contents.section, section))
      .orderBy(asc(contents.order));
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    const result = await db
      .select()
      .from(contents)
      .where(eq(contents.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getContentByKey(key: string): Promise<Content | undefined> {
    const result = await db
      .select()
      .from(contents)
      .where(eq(contents.key, key));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createContent(content: InsertContent): Promise<Content> {
    const [result] = await db
      .insert(contents)
      .values({
        ...content,
        updatedAt: new Date()
      })
      .returning();
    return result;
  }
  
  async updateContent(id: number, content: UpdateContent): Promise<Content | undefined> {
    const [result] = await db
      .update(contents)
      .set({
        ...content,
        updatedAt: new Date()
      })
      .where(eq(contents.id, id))
      .returning();
    return result;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    const result = await db
      .delete(contents)
      .where(eq(contents.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();

// Create admin user only if table is empty
(async () => {
  try {
    // First check if any users exist at all
    const [result] = await db.select({ value: count() }).from(users);
    if (result.value === 0) {
      // Create admin user only if no users exist
      await storage.createUser({
        username: 'admin',
        password: 'admin123',
        isAdmin: true
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user', error);
  }
})();
