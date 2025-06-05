import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-mem";
import { telegramService } from "./telegram";
import { 
  loginUserSchema, 
  insertInquirySchema, 
  insertVisitSchema, 
  contentSchema,
  updateContentSchema
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: "tpms-sensor-website-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        if (user.password !== password) { // In a real app, use proper password hashing
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Create admin user if it doesn't exist
  const adminExists = await storage.getUserByUsername("admin");
  if (!adminExists) {
    await storage.createUser({
      username: "admin",
      password: "admin123", // In a real app, this should be hashed
      isAdmin: true,
    });
  }

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const result = loginUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json({ user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ success: true });
    });
  });

  // Inquiries routes
  app.post("/api/inquiries", async (req, res, next) => {
    try {
      const result = insertInquirySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const inquiry = await storage.createInquiry(result.data);
      
      // Send Telegram notification (don't wait for it to complete)
      telegramService.sendInquiryNotification(inquiry).catch(error => {
        console.error('Failed to send Telegram notification:', error);
      });
      
      res.status(201).json(inquiry);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/inquiries", ensureAdmin, async (req, res, next) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/inquiries/:id/status", ensureAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["new", "processing", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const inquiry = await storage.updateInquiryStatus(id, status);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      next(error);
    }
  });

  // Analytics routes
  app.post("/api/visits", async (req, res, next) => {
    try {
      const result = insertVisitSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const visit = await storage.recordVisit(result.data);
      res.status(201).json(visit);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/summary", ensureAdmin, async (req, res, next) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const totalVisits = await storage.getVisitsCount(thirtyDaysAgo);
      const newInquiries = await storage.getInquiriesCount(thirtyDaysAgo);
      const conversionRate = totalVisits > 0 ? ((newInquiries / totalVisits) * 100).toFixed(2) : "0.00";
      
      res.json({
        totalVisits,
        newInquiries,
        conversionRate,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/traffic-sources", ensureAdmin, async (req, res, next) => {
    try {
      const sources = await storage.getTrafficSourcesBreakdown();
      res.json(sources);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/popular-pages", ensureAdmin, async (req, res, next) => {
    try {
      const pages = await storage.getPopularPages();
      res.json(pages);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/visits-over-time", ensureAdmin, async (req, res, next) => {
    try {
      const period = req.query.period as string || "30days";
      let startDate = new Date();
      
      if (period === "30days") {
        startDate.setDate(startDate.getDate() - 30);
      } else if (period === "3months") {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (period === "year") {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
      
      const visitsData = await storage.getVisitsOverTime(startDate);
      res.json(visitsData);
    } catch (error) {
      next(error);
    }
  });
  
  // Content Management Routes - Public read-only endpoints
  app.get("/api/contents", async (req, res, next) => {
    try {
      const section = req.query.section as string;
      let contents;
      
      if (section) {
        contents = await storage.getContentsBySection(section);
      } else {
        contents = await storage.getAllContents();
      }
      
      res.json(contents);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/contents/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      next(error);
    }
  });
  
  // These endpoints require admin authentication
  app.post("/api/contents", ensureAdmin, async (req, res, next) => {
    try {
      const result = contentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      
      const content = await storage.createContent(result.data);
      res.status(201).json(content);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/contents/:id", ensureAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateContentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      
      const content = await storage.updateContent(id, result.data);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete("/api/contents/:id", ensureAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  // Telegram test endpoint
  app.post("/api/telegram/test", ensureAdmin, async (req, res, next) => {
    try {
      const success = await telegramService.sendTestMessage();
      
      if (success) {
        res.json({ success: true, message: "Test message sent successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send test message" });
      }
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Middleware to ensure user is admin
function ensureAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && (req.user as any).isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
