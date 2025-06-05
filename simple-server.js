const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// In-memory data storage
const data = {
  inquiries: [],
  visits: [],
  nextInquiryId: 1,
  nextVisitId: 1
};

// API Routes
app.post('/api/visits', (req, res) => {
  const visit = {
    id: data.nextVisitId++,
    date: new Date(),
    page: req.body.page || '/',
    source: req.body.source || null
  };
  data.visits.push(visit);
  res.status(201).json(visit);
});

app.post('/api/inquiries', (req, res) => {
  const inquiry = {
    id: data.nextInquiryId++,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email || null,
    carModel: req.body.carModel || null,
    message: req.body.message || null,
    status: 'new',
    createdAt: new Date()
  };
  data.inquiries.push(inquiry);
  console.log('New inquiry received:', inquiry);
  res.status(201).json(inquiry);
});

app.get('/api/inquiries', (req, res) => {
  res.json(data.inquiries);
});

// Simple auth for admin
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ user: { id: 1, username: 'admin', isAdmin: true } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/auth/session', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

// Serve static HTML for frontend
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farsensor - TPMS датчики</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #000; color: #FCB040; padding: 1rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero { background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #FCB040; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 4rem 0; }
        .feature { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #FCB040; }
        .feature h3 { color: #000; margin-bottom: 1rem; }
        .contact-form { background: #f9f9f9; padding: 3rem; border-radius: 8px; margin: 2rem 0; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; }
        .btn { background: #FCB040; color: #000; padding: 1rem 2rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .btn:hover { background: #e09a35; }
        .footer { background: #000; color: #FCB040; padding: 2rem; text-align: center; margin-top: 4rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .stat { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; font-weight: bold; color: #FCB040; }
        .stat-label { color: #666; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <header class="header">
        <h2>FARSENSOR - Датчики давления шин TPMS</h2>
    </header>

    <section class="hero">
        <h1>Профессиональные TPMS датчики</h1>
        <p>Высококачественные датчики давления шин для вашего автомобиля</p>
    </section>

    <div class="container">
        <div class="stats">
            <div class="stat">
                <div class="stat-number">5+</div>
                <div class="stat-label">лет опыта</div>
            </div>
            <div class="stat">
                <div class="stat-number">50k+</div>
                <div class="stat-label">датчиков продано</div>
            </div>
            <div class="stat">
                <div class="stat-number">2000+</div>
                <div class="stat-label">довольных клиентов</div>
            </div>
        </div>

        <div class="features">
            <div class="feature">
                <h3>Универсальные датчики</h3>
                <p>Совместимы с большинством автомобилей. Цена: 8000 тенге</p>
            </div>
            <div class="feature">
                <h3>Оригинальные датчики</h3>
                <p>Датчики от производителя автомобиля. Цена: 12000 тенге</p>
            </div>
            <div class="feature">
                <h3>Программирование</h3>
                <p>Профессиональное программирование датчиков. Цена: 3000 тенге</p>
            </div>
            <div class="feature">
                <h3>Диагностика TPMS</h3>
                <p>Полная диагностика системы TPMS. Цена: 2000 тенге</p>
            </div>
            <div class="feature">
                <h3>Замена батареек</h3>
                <p>Замена батареек в датчиках. Цена: 4000 тенге<br><small>* Не все датчики поддерживают замену батарейки</small></p>
            </div>
            <div class="feature">
                <h3>Установка датчиков</h3>
                <p>Профессиональная установка. Цена: 2000 тенге</p>
            </div>
        </div>

        <div class="contact-form">
            <h2>Оставить заявку</h2>
            <form id="inquiryForm">
                <div class="form-group">
                    <label for="name">Имя *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="phone">Телефон *</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="carModel">Модель автомобиля</label>
                    <input type="text" id="carModel" name="carModel">
                </div>
                <div class="form-group">
                    <label for="message">Сообщение</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                </div>
                <button type="submit" class="btn">Отправить заявку</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Farsensor. Все права защищены.</p>
        <p>Алматы, Казахстан | Тел: +7 (777) 123-45-67</p>
    </footer>

    <script>
        // Record visit
        fetch('/api/visits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: '/', source: 'direct' })
        });

        // Handle form submission
        document.getElementById('inquiryForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                    e.target.reset();
                } else {
                    alert('Ошибка при отправке заявки.');
                }
            } catch (error) {
                alert('Ошибка при отправке заявки.');
            }
        });
    </script>
</body>
</html>
  `);
});

// Admin panel
app.get('/admin', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farsensor - Админ панель</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { background: #000; color: #FCB040; padding: 1rem; text-align: center; margin-bottom: 2rem; }
        .login-form { background: white; padding: 2rem; border-radius: 8px; max-width: 400px; margin: 2rem auto; }
        .dashboard { display: none; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #FCB040; }
        .inquiries { background: white; padding: 2rem; border-radius: 8px; }
        .inquiry { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; }
        .form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; }
        .btn { background: #FCB040; color: #000; padding: 0.8rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #e09a35; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Farsensor - Админ панель</h1>
    </div>

    <div class="container">
        <div id="loginForm" class="login-form">
            <h2>Вход в систему</h2>
            <form onsubmit="login(event)">
                <div class="form-group">
                    <label>Логин:</label>
                    <input type="text" id="username" value="admin" required>
                </div>
                <div class="form-group">
                    <label>Пароль:</label>
                    <input type="password" id="password" value="admin123" required>
                </div>
                <button type="submit" class="btn">Войти</button>
            </form>
        </div>

        <div id="dashboard" class="dashboard">
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalInquiries">0</div>
                    <div>Всего заявок</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalVisits">0</div>
                    <div>Всего посещений</div>
                </div>
            </div>

            <div class="inquiries">
                <h2>Заявки клиентов</h2>
                <div id="inquiriesList"></div>
            </div>
        </div>
    </div>

    <script>
        async function login(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    document.getElementById('loginForm').style.display = 'none';
                    document.getElementById('dashboard').style.display = 'block';
                    loadDashboard();
                } else {
                    alert('Неверный логин или пароль');
                }
            } catch (error) {
                alert('Ошибка входа в систему');
            }
        }

        async function loadDashboard() {
            try {
                const inquiriesResponse = await fetch('/api/inquiries');
                const inquiries = await inquiriesResponse.json();
                
                document.getElementById('totalInquiries').textContent = inquiries.length;
                
                const inquiriesHtml = inquiries.map(inquiry => \`
                    <div class="inquiry">
                        <h3>\${inquiry.name}</h3>
                        <p><strong>Телефон:</strong> \${inquiry.phone}</p>
                        \${inquiry.email ? \`<p><strong>Email:</strong> \${inquiry.email}</p>\` : ''}
                        \${inquiry.carModel ? \`<p><strong>Автомобиль:</strong> \${inquiry.carModel}</p>\` : ''}
                        \${inquiry.message ? \`<p><strong>Сообщение:</strong> \${inquiry.message}</p>\` : ''}
                        <p><strong>Дата:</strong> \${new Date(inquiry.createdAt).toLocaleString('ru-RU')}</p>
                    </div>
                \`).join('');
                
                document.getElementById('inquiriesList').innerHTML = inquiriesHtml || '<p>Заявок пока нет</p>';
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        }
    </script>
</body>
</html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Farsensor server running on port \${PORT}\`);
  console.log(\`Website: http://localhost:\${PORT}\`);
  console.log(\`Admin: http://localhost:\${PORT}/admin\`);
});