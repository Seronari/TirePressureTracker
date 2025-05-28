import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './ui/language-switcher';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMenu();
  };

  return (
    <header className="bg-black shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Farsensor Logo" 
                className="h-16 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('about')} className="text-primary hover:text-yellow-400 transition-colors duration-300">
              {t('nav.about')}
            </button>
            <button onClick={() => scrollToSection('products')} className="text-primary hover:text-yellow-400 transition-colors duration-300">
              {t('nav.products')}
            </button>
            <button onClick={() => scrollToSection('services')} className="text-primary hover:text-yellow-400 transition-colors duration-300">
              {t('nav.services')}
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-primary hover:text-yellow-400 transition-colors duration-300">
              {t('nav.contact')}
            </button>
            
            <LanguageSwitcher className="ml-4" />
            
            <Link href={user ? '/admin/dashboard' : '/admin/login'}>
              <Button variant="ghost" className="ml-4 text-sm text-primary hover:text-yellow-400 transition-colors duration-300">
                <User className="h-4 w-4 mr-1" />
                {t('nav.admin')}
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-primary focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <nav className="flex flex-col space-y-3">
            <button onClick={() => scrollToSection('about')} className="text-primary hover:text-yellow-400 py-2 transition-colors duration-300 text-left">
              {t('nav.about')}
            </button>
            <button onClick={() => scrollToSection('products')} className="text-primary hover:text-yellow-400 py-2 transition-colors duration-300 text-left">
              {t('nav.products')}
            </button>
            <button onClick={() => scrollToSection('services')} className="text-primary hover:text-yellow-400 py-2 transition-colors duration-300 text-left">
              {t('nav.services')}
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-primary hover:text-yellow-400 py-2 transition-colors duration-300 text-left">
              {t('nav.contact')}
            </button>
            
            <div className="flex items-center justify-between py-2">
              <LanguageSwitcher />
              
              <Link href={user ? '/admin/dashboard' : '/admin/login'} onClick={closeMenu} className="text-sm text-primary hover:text-yellow-400 transition-colors duration-300">
                <User className="h-4 w-4 inline mr-1" />
                {t('nav.admin')}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
