// Language switching functionality
let currentLanguage = 'ru';

const translations = {
    ru: {
        // Navigation
        'nav.about': 'О нас',
        'nav.products': 'Продукция',
        'nav.services': 'Услуги',
        'nav.contact': 'Контакты',
        
        // Hero section
        'hero.title': 'FARSENSOR',
        'hero.subtitle': 'TPMS ДАТЧИКИ',
        'hero.description': 'Профессиональные системы контроля давления в шинах.<br>5+ лет опыта, 50000+ установленных датчиков, 2000+ довольных клиентов.',
        'hero.cta': 'Получить консультацию',
        
        // About section
        'about.title': 'О компании Farsensor',
        'about.description': 'Мы специализируемся на TPMS датчиках и системах контроля давления в шинах более 5 лет.',
        'about.years': '5+ лет',
        'about.years.desc': 'на рынке TPMS технологий',
        'about.sensors': '50000+',
        'about.sensors.desc': 'установленных датчиков',
        'about.clients': '2000+',
        'about.clients.desc': 'довольных клиентов',
        
        // Products section
        'products.title': 'Наша продукция',
        'products.description': 'Полный спектр TPMS решений для любых потребностей',
        'products.universal.title': 'Универсальные датчики',
        'products.universal.desc': 'Совместимы с большинством автомобилей. Простая установка и настройка.',
        'products.oem.title': 'OEM датчики',
        'products.oem.desc': 'Оригинальные датчики для конкретных моделей автомобилей.',
        'products.programmers.title': 'Программаторы',
        'products.programmers.desc': 'Профессиональное оборудование для программирования датчиков.',
        'products.order': 'Заказать',
        'products.price.request': 'Узнать цену',
        'products.price.on.request': 'Цена по запросу',
        
        // Services section
        'services.title': 'Наши услуги',
        'services.description': 'Полный цикл обслуживания TPMS систем',
        'services.installation.title': 'Установка датчиков',
        'services.installation.desc': 'Профессиональная установка TPMS датчиков на любые автомобили',
        'services.battery.title': 'Замена батарей',
        'services.battery.desc': 'Замена батарей в датчиках (при технической возможности)',
        'services.battery.note': 'Battery changing performing only if it\'s possible',
        
        // Contact section
        'contact.title': 'Свяжитесь с нами',
        'contact.description': 'Готовы ответить на все ваши вопросы',
        'contact.form.title': 'Отправить запрос',
        'contact.form.name': 'Имя *',
        'contact.form.phone': 'Телефон *',
        'contact.form.email': 'Email',
        'contact.form.car': 'Модель автомобиля',
        'contact.form.message': 'Сообщение *',
        'contact.form.submit': 'Отправить запрос',
        'contact.info.title': 'Контактная информация',
        'contact.phone': 'Телефон',
        'contact.address': 'Адрес',
        'contact.address.value': 'Алматы, Казахстан',
        
        // Footer
        'footer.description': 'Профессиональные TPMS решения для вашего автомобиля',
        'footer.products': 'Продукция',
        'footer.services': 'Услуги',
        'footer.copyright': '© 2024 Farsensor. Все права защищены.'
    },
    
    kk: {
        // Navigation
        'nav.about': 'Біз туралы',
        'nav.products': 'Өнімдер',
        'nav.services': 'Қызметтер',
        'nav.contact': 'Байланыс',
        
        // Hero section
        'hero.title': 'FARSENSOR',
        'hero.subtitle': 'TPMS СЕНСОРЛАРЫ',
        'hero.description': 'Дөңгелектердегі қысымды бақылаудың кәсіби жүйелері.<br>5+ жыл тәжірибе, 50000+ орнатылған сенсор, 2000+ қанағаттанған клиент.',
        'hero.cta': 'Кеңес алу',
        
        // About section
        'about.title': 'Farsensor компаниясы туралы',
        'about.description': 'Біз 5 жылдан астам уақыт бойы TPMS сенсорлары мен дөңгелектердегі қысымды бақылау жүйелеріне мамандандық.',
        'about.years': '5+ жыл',
        'about.years.desc': 'TPMS технологиялар нарығында',
        'about.sensors': '50000+',
        'about.sensors.desc': 'орнатылған сенсор',
        'about.clients': '2000+',
        'about.clients.desc': 'қанағаттанған клиент',
        
        // Products section
        'products.title': 'Біздің өнімдер',
        'products.description': 'Кез келген қажеттіліктер үшін TPMS шешімдерінің толық спектрі',
        'products.universal.title': 'Универсалды сенсорлар',
        'products.universal.desc': 'Көптеген автомобильдермен үйлесімді. Оңай орнату және баптау.',
        'products.oem.title': 'OEM сенсорлары',
        'products.oem.desc': 'Автомобильдердің нақты модельдеріне арналған түпнұсқа сенсорлар.',
        'products.programmers.title': 'Программаторлар',
        'products.programmers.desc': 'Сенсорларды программалауға арналған кәсіби жабдық.',
        'products.order': 'Тапсырыс беру',
        'products.price.request': 'Бағаны білу',
        'products.price.on.request': 'Бағасы сұраныс бойынша',
        
        // Services section
        'services.title': 'Біздің қызметтер',
        'services.description': 'TPMS жүйелерін қызмет көрсетудің толық циклы',
        'services.installation.title': 'Сенсорларды орнату',
        'services.installation.desc': 'Кез келген автомобильге TPMS сенсорларын кәсіби орнату',
        'services.battery.title': 'Батареяларды ауыстыру',
        'services.battery.desc': 'Сенсорлардағы батареяларды ауыстыру (техникалық мүмкіндігі болған жағдайда)',
        'services.battery.note': 'Батареяны ауыстыру тек техникалық мүмкіндік болған жағдайда ғана жүзеге асырылады',
        
        // Contact section
        'contact.title': 'Бізбен байланысыңыз',
        'contact.description': 'Барлық сұрақтарыңызға жауап беруге дайынбыз',
        'contact.form.title': 'Сұраныс жіберу',
        'contact.form.name': 'Аты *',
        'contact.form.phone': 'Телефон *',
        'contact.form.email': 'Email',
        'contact.form.car': 'Автомобиль моделі',
        'contact.form.message': 'Хабарлама *',
        'contact.form.submit': 'Сұраныс жіберу',
        'contact.info.title': 'Байланыс ақпараты',
        'contact.phone': 'Телефон',
        'contact.address': 'Мекенжай',
        'contact.address.value': 'Алматы, Қазақстан',
        
        // Footer
        'footer.description': 'Сіздің автомобиліңіз үшін кәсіби TPMS шешімдері',
        'footer.products': 'Өнімдер',
        'footer.services': 'Қызметтер',
        'footer.copyright': '© 2024 Farsensor. Барлық құқықтар қорғалған.'
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSwitcher();
    initializeMobileMenu();
    initializeContactForm();
    initializeSmoothScrolling();
    recordPageVisit();
    
    // Set initial language
    updateLanguage(currentLanguage);
});

// Language switcher functionality
function initializeLanguageSwitcher() {
    const toggle = document.getElementById('lang-toggle');
    const slider = document.getElementById('lang-slider');
    const ruLabel = document.getElementById('lang-ru');
    const kkLabel = document.getElementById('lang-kk');
    
    if (!toggle || !slider || !ruLabel || !kkLabel) return;
    
    // Handle toggle change
    toggle.addEventListener('change', function() {
        const isKazakh = this.checked;
        currentLanguage = isKazakh ? 'kk' : 'ru';
        
        // Update slider position
        if (isKazakh) {
            slider.style.transform = 'translateX(20px)';
        } else {
            slider.style.transform = 'translateX(0)';
        }
        
        // Update label colors
        ruLabel.className = isKazakh ? 'text-gray-400 cursor-pointer font-medium' : 'text-primary cursor-pointer font-medium';
        kkLabel.className = isKazakh ? 'text-primary cursor-pointer font-medium' : 'text-gray-400 cursor-pointer font-medium';
        
        // Update page content
        updateLanguage(currentLanguage);
    });
    
    // Handle label clicks
    ruLabel.addEventListener('click', function() {
        if (currentLanguage !== 'ru') {
            toggle.checked = false;
            toggle.dispatchEvent(new Event('change'));
        }
    });
    
    kkLabel.addEventListener('click', function() {
        if (currentLanguage !== 'kk') {
            toggle.checked = true;
            toggle.dispatchEvent(new Event('change'));
        }
    });
}

// Update page content based on language
function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Update document title and meta description
    if (lang === 'kk') {
        document.title = 'Farsensor - TPMS Сенсорлары және Дөңгелектердегі Қысымды Бақылау Жүйелері';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Кәсіби TPMS сенсорлары, универсалды және OEM сенсорлар, программаторлар және дөңгелектердегі қысымды бақылау жабдықтары. 5+ жыл нарықта, 50000+ орнатылған сенсор.';
        }
    } else {
        document.title = 'Farsensor - TPMS Датчики и Системы Контроля Давления в Шинах';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Профессиональные TPMS датчики, универсальные и OEM сенсоры, программаторы и оборудование для контроля давления в шинах. 5+ лет на рынке, 50000+ установленных датчиков.';
        }
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Update button icon
        const svg = menuBtn.querySelector('svg path');
        if (mobileMenu.classList.contains('hidden')) {
            svg.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Menu icon
        } else {
            svg.setAttribute('d', 'M6 18L18 6M6 6l12 12'); // X icon
        }
    });
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const svg = menuBtn.querySelector('svg path');
            svg.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    
    if (!form || !messageDiv) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            carModel: formData.get('carModel'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!data.name || !data.phone || !data.message) {
            showMessage('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                showMessage('Спасибо! Ваш запрос отправлен. Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Произошла ошибка при отправке запроса. Попробуйте еще раз.', 'error');
        }
    });
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `mt-4 p-3 rounded ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        messageDiv.classList.remove('hidden');
        
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function for scrolling to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Open contact form with pre-filled message
function openContactForm(productType) {
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
        const message = currentLanguage === 'kk' 
            ? `Мен ${productType} туралы ақпарат алғым келеді.`
            : `Хочу получить информацию о ${productType}.`;
        messageField.value = message;
    }
    
    scrollToSection('contact');
}

// Record page visit for analytics
async function recordPageVisit() {
    try {
        await fetch('/api/visits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: window.location.pathname,
                source: document.referrer ? 'referral' : 'direct'
            })
        });
    } catch (error) {
        console.log('Visit tracking failed:', error);
    }
}

// Add fade-in animation on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll('.hover-lift, section > div');
    elements.forEach(el => observer.observe(el));
}

// Initialize scroll animations after page load
window.addEventListener('load', initializeScrollAnimations);