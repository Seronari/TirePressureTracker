import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory storage
let inquiries: any[] = [];
let visits: any[] = [];
let inquiryId = 1;
let visitId = 1;

// Basic logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// Routes
app.post("/api/inquiries", (req, res) => {
  const inquiry = {
    id: inquiryId++,
    ...req.body,
    status: "new",
    createdAt: new Date().toISOString()
  };
  inquiries.push(inquiry);
  res.json(inquiry);
});

app.post("/api/visits", (req, res) => {
  const visit = {
    id: visitId++,
    ...req.body,
    date: new Date().toISOString()
  };
  visits.push(visit);
  res.json(visit);
});

app.get("/api/auth/session", (req, res) => {
  res.status(401).json({ message: "Not authenticated" });
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  log(`Error: ${message}`);
});

const server = setupVite(app, undefined as any);

const PORT = 5000;
server?.listen(PORT, "0.0.0.0", () => {
  log(`serving on port ${PORT}`);
});