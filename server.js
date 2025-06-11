const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory storage
let inquiries = [];
let visits = [];
let inquiryId = 1;
let visitId = 1;

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist/public')));

// API Routes
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

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});