import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage
let inquiries: any[] = [];
let visits: any[] = [];
let inquiryId = 1;
let visitId = 1;

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req;

  if (url?.startsWith('/api/inquiries') && req.method === 'POST') {
    const inquiry = {
      id: inquiryId++,
      ...req.body,
      status: "new",
      createdAt: new Date().toISOString()
    };
    inquiries.push(inquiry);
    res.status(201).json(inquiry);
    return;
  }

  if (url?.startsWith('/api/visits') && req.method === 'POST') {
    const visit = {
      id: visitId++,
      ...req.body,
      date: new Date().toISOString()
    };
    visits.push(visit);
    res.status(201).json(visit);
    return;
  }

  if (url?.startsWith('/api/auth/session') && req.method === 'GET') {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  // Default response for unmatched routes
  res.status(404).json({ message: "API route not found" });
}