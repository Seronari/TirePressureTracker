import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Smartphone, Mail } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 font-condensed">{t('footer.aboutCompany')}</h3>
            <p className="mb-4 text-gray-300">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors duration-300" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors duration-300" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors duration-300" aria-label="Telegram">
                <FaTelegramPlane />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-condensed">{t('footer.products')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.universalSensors')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.oemSensors')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.programmers')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.accessories')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.spareParts')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-condensed">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.installation')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.diagnostics')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.batteryReplacement')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.wholesaleSupply')}</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{t('footer.specialistTraining')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-condensed">{t('footer.contacts')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-accent" />
                <span className="text-gray-300">{t('contact.address')}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-accent" />
                <span className="text-gray-300">{t('contact.phone1')}</span>
              </li>
              <li className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-accent" />
                <span className="text-gray-300">{t('contact.phone2')}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-accent" />
                <span className="text-gray-300">{t('contact.email')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} TPMSPro. {t('footer.rights')}
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">{t('footer.privacy')}</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
