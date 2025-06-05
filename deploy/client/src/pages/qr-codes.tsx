import { QRGenerator, ContactQRGenerator, WebsiteQRGenerator } from '@/components/ui/qr-generator';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useTranslation } from 'react-i18next';

export default function QRCodes() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-light">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary mb-4 font-condensed">
              QR Code Generator
            </h1>
            <p className="text-lg text-dark-gray max-w-2xl mx-auto">
              Generate QR codes for your business needs - share contact info, website links, or any custom information with your customers instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Custom QR Generator */}
            <QRGenerator 
              title="Custom QR Code"
              className="w-full"
            />

            {/* Contact QR Generator */}
            <ContactQRGenerator />

            {/* Website QR Generator */}
            <WebsiteQRGenerator />
          </div>

          <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-secondary mb-6 text-center font-condensed">
              QR Code Ideas for Your TPMS Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Contact Information</h3>
                <p className="text-dark-gray text-sm">
                  Share your phone, email, and address instantly with customers
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Website Link</h3>
                <p className="text-dark-gray text-sm">
                  Direct customers to your website or specific product pages
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Service Instructions</h3>
                <p className="text-dark-gray text-sm">
                  Link to TPMS installation guides or troubleshooting tips
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Reviews & Ratings</h3>
                <p className="text-dark-gray text-sm">
                  Direct satisfied customers to leave reviews on Google or social media
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Social Media</h3>
                <p className="text-dark-gray text-sm">
                  Connect customers to your Facebook, Instagram, or other social accounts
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Product Catalog</h3>
                <p className="text-dark-gray text-sm">
                  Link to specific TPMS sensor compatibility charts or product info
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}