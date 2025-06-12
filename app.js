const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demo purposes
let inquiries = [];
let visits = [];
let nextInquiryId = 1;
let nextVisitId = 1;

// API Routes
app.post('/api/inquiries', (req, res) => {
  const inquiry = {
    id: nextInquiryId++,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    carModel: req.body.carModel,
    message: req.body.message,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  
  inquiries.push(inquiry);
  console.log('New inquiry received:', inquiry);
  
  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully',
    id: inquiry.id
  });
});

app.post('/api/visits', (req, res) => {
  const visit = {
    id: nextVisitId++,
    page: req.body.page || '/',
    source: req.body.source || 'direct',
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    timestamp: new Date().toISOString()
  };
  
  visits.push(visit);
  res.status(201).json({ success: true });
});

app.get('/api/inquiries', (req, res) => {
  res.json(inquiries);
});

app.get('/api/visits', (req, res) => {
  res.json(visits);
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Farsensor website running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;