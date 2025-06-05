const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for legacy deployment
class MemStorage {
  constructor() {
    this.users = [];
    this.inquiries = [];
    this.visits = [];
    this.nextUserId = 1;
    this.nextInquiryId = 1;
    this.nextVisitId = 1;

    // Initialize with admin user
    this.users.push({
      id: this.nextUserId++,
      username: "admin",
      password: "$2b$10$8K1p/a0dhrxSHxHmy4q/h.uN7.1l.JX9.S8D7SJXE4E.9E1.E4E4E",
      isAdmin: true
    });
  }

  async getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  async getUser(id) {
    return this.users.find(u => u.id === id);
  }

  async createInquiry(inquiry) {
    const newInquiry = {
      id: this.nextInquiryId++,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email || null,
      carModel: inquiry.carModel || null,
      message: inquiry.message || null,
      status: "new",
      createdAt: new Date()
    };
    this.inquiries.push(newInquiry);
    return newInquiry;
  }

  async recordVisit(visit) {
    const newVisit = {
      id: this.nextVisitId++,
      date: new Date(),
      page: visit.page,
      source: visit.source || null
    };
    this.visits.push(newVisit);
    return newVisit;
  }
}

const storage = new MemStorage();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false);
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes
app.post('/api/visits', async (req, res) => {
  try {
    const visit = await storage.recordVisit(req.body);
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = await storage.createInquiry(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/auth/session', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Legacy server running on port ${PORT}`);
});