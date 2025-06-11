import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isKazakh, setIsKazakh] = useState(i18n.language === 'kk');

  useEffect(() => {
    localStorage.setItem('language', i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = isKazakh ? 'ru' : 'kk';
    i18n.changeLanguage(newLang);
    setIsKazakh(!isKazakh);
  };

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <span className={`mr-2 text-sm font-medium transition-colors ${!isKazakh ? 'text-primary' : 'text-gray-400'}`}>РУС</span>
      <div className="relative">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={isKazakh}
          onChange={toggleLanguage}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-200"></div>
        <div className={`absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition-all ${isKazakh ? 'translate-x-5' : ''}`}></div>
      </div>
      <span className={`ml-2 text-sm font-medium transition-colors ${isKazakh ? 'text-primary' : 'text-gray-400'}`}>ҚАЗ</span>
    </label>
  );
}
