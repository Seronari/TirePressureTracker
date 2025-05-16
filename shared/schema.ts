import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  carModel: text("car_model"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // 'new', 'processing', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow(),
  page: text("page").notNull(),
  source: text("source"), // 'search', 'direct', 'social', 'other'
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  phone: true,
  email: true,
  carModel: true,
  message: true,
});

export const insertVisitSchema = createInsertSchema(visits).pick({
  page: true,
  source: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type User = typeof users.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type Visit = typeof visits.$inferSelect;
