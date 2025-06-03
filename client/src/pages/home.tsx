import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { inquiryFormSchema, type InquiryFormValues } from '@/lib/validations';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { GoogleMap } from '@/components/ui/google-map';
import { Shield, Fuel, Drill, ChevronDown, MapPin, Phone, Smartphone, Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Image paths - replace these with your local images when deploying
  const images = {
    hero: '/images/hero-bg.jpg',
    about: '/images/about-section.jpg',
    products: {
      universal: '/images/universal-sensors.jpg',
      oem: '/images/oem-sensors.jpg',
      programmers: '/images/programmers.jpg'
    }
  };

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      carModel: '',
      message: '',
      terms: false
    }
  });

  const inquiryMutation = useMutation({
    mutationFn: async (values: InquiryFormValues) => {
      const { terms, ...data } = values;
      const response = await apiRequest('POST', '/api/inquiries', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorMessage'),
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: InquiryFormValues) => {
    inquiryMutation.mutate(values);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-secondary text-white py-20 bg-cover bg-center relative" style={{backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.85), rgba(44, 62, 80, 0.85)), url('${images.hero}')`}}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-condensed">
                {t('hero.title')}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#products" className="btn-primary text-center">
                  {t('hero.productsButton')}
                </a>
                <a href="#contact" className="btn-secondary text-center">
                  {t('hero.contactButton')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="heading-lg mb-6">{t('about.title')}</h2>
                <p className="mb-4 text-dark-gray">
                  {t('about.paragraph1')}
                </p>
                <p className="mb-4 text-dark-gray">
                  {t('about.paragraph2')}
                </p>
                <div className="flex gap-4 mt-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">10+</p>
                    <p className="text-mid-gray">{t('about.yearsOnMarket')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">10k+</p>
                    <p className="text-mid-gray">{t('about.sensorsInstalled')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">500+</p>
                    <p className="text-mid-gray">{t('about.clients')}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={images.about} 
                  alt={t('about.imageAlt')} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-light">
          <div className="container">
            <h2 className="heading-lg mb-12 text-center">{t('features.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card">
                <div className="icon-circle">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('features.safety.title')}</h3>
                <p className="text-dark-gray">
                  {t('features.safety.description')}
                </p>
              </div>
              
              <div className="feature-card">
                <div className="icon-circle">
                  <Fuel className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('features.fuelSaving.title')}</h3>
                <p className="text-dark-gray">
                  {t('features.fuelSaving.description')}
                </p>
              </div>
              
              <div className="feature-card">
                <div className="icon-circle">
                  <Drill className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('features.convenience.title')}</h3>
                <p className="text-dark-gray">
                  {t('features.convenience.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="section bg-white">
          <div className="container">
            <h2 className="heading-lg mb-12 text-center">{t('products.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="product-card h-full flex flex-col">
                <img 
                  src={images.products.universal} 
                  alt={t('products.universal.imageAlt')} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-secondary font-condensed">{t('products.universal.title')}</h3>
                  <p className="text-dark-gray mb-4 flex-grow">
                    {t('products.universal.description')}
                  </p>
                  <div className="flex flex-col space-y-2 mt-auto">
                    <span className="text-lg font-bold text-primary">{t('products.universal.price')}</span>
                    <span className="text-sm text-gray-600 italic">{t('products.contactForInfo')}</span>
                  </div>
                </div>
              </div>
              
              <div className="product-card h-full flex flex-col">
                <img 
                  src={images.products.oem} 
                  alt={t('products.oem.imageAlt')} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-secondary font-condensed">{t('products.oem.title')}</h3>
                  <p className="text-dark-gray mb-4 flex-grow">
                    {t('products.oem.description')}
                  </p>
                  <div className="flex flex-col space-y-2 mt-auto">
                    <span className="text-lg font-bold text-primary">{t('products.oem.price')}</span>
                    <span className="text-sm text-gray-600 italic">{t('products.contactForInfo')}</span>
                  </div>
                </div>
              </div>
              
              <div className="product-card h-full flex flex-col">
                <img 
                  src={images.products.programmers} 
                  alt={t('products.programmers.imageAlt')} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-secondary font-condensed">{t('products.programmers.title')}</h3>
                  <p className="text-dark-gray mb-4 flex-grow">
                    {t('products.programmers.description')}
                  </p>
                  <div className="flex flex-col space-y-2 mt-auto">
                    <span className="text-lg font-bold text-primary">{t('products.programmers.price')}</span>
                    <span className="text-sm text-gray-600 italic">{t('products.contactForInfo')}</span>
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section bg-light">
          <div className="container">
            <h2 className="heading-lg mb-12 text-center">{t('services.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="service-card">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                    <Drill className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('services.installation.title')}</h3>
                  <p className="text-dark-gray mb-3">
                    {t('services.installation.description')}
                  </p>
                  <p className="font-bold text-primary">{t('services.installation.price')}</p>
                </div>
              </div>
              
              <div className="service-card">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('services.batteryReplacement.title')}</h3>
                  <p className="text-dark-gray mb-3">
                    {t('services.batteryReplacement.description')}
                  </p>
                  <p className="font-bold text-primary">{t('services.batteryReplacement.price')}</p>
                </div>
              </div>
              
              <div className="service-card">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stethoscope"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('services.diagnostics.title')}</h3>
                  <p className="text-dark-gray mb-3">
                    {t('services.diagnostics.description')}
                  </p>
                  <p className="font-bold text-primary">{t('services.diagnostics.price')}</p>
                </div>
              </div>
              
              <div className="service-card">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-secondary font-condensed">{t('services.wholesale.title')}</h3>
                  <p className="text-dark-gray mb-3">
                    {t('services.wholesale.description')}
                  </p>
                  <p className="font-bold text-primary">{t('services.wholesale.price')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 order-2 md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1552748322-922e93d25c2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt={t('info.imageAlt')} 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <h2 className="heading-lg mb-6">{t('info.title')}</h2>
                <p className="mb-4 text-dark-gray">
                  {t('info.paragraph1')}
                </p>
                <p className="mb-4 text-dark-gray">
                  {t('info.paragraph2')}
                </p>
                <ul className="list-disc pl-5 mb-6 text-dark-gray">
                  <li className="mb-2">{t('info.benefit1')}</li>
                  <li className="mb-2">{t('info.benefit2')}</li>
                  <li className="mb-2">{t('info.benefit3')}</li>
                  <li>{t('info.benefit4')}</li>
                </ul>
                <p className="mb-4 text-dark-gray">
                  {t('info.paragraph3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-light">
          <div className="container max-w-4xl">
            <h2 className="heading-lg mb-12 text-center">{t('faq.title')}</h2>
            
            <div className="space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1" className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="font-bold text-lg text-secondary font-condensed">{t('faq.question1')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-dark-gray">
                      {t('faq.answer1')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-2" className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="font-bold text-lg text-secondary font-condensed">{t('faq.question2')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-dark-gray">
                      {t('faq.answer2')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-3" className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="font-bold text-lg text-secondary font-condensed">{t('faq.question3')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-dark-gray">
                      {t('faq.answer3')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-4" className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="font-bold text-lg text-secondary font-condensed">{t('faq.question4')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-dark-gray">
                      {t('faq.answer4')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section bg-white">
          <div className="container">
            <h2 className="heading-lg mb-12 text-center">{t('contact.title')}</h2>
            
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="bg-light p-8 rounded-lg shadow-md h-full">
                  <h3 className="text-xl font-bold mb-6 text-secondary font-condensed">{t('contact.form.title')}</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.form.name')}*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.form.phone')}*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.email')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="carModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.carModel')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.message')}</FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-mid-gray">
                                {t('contact.form.terms1')} <a href="#" className="text-primary hover:underline">{t('contact.form.terms2')}</a>*
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-primary"
                        disabled={inquiryMutation.isPending}
                      >
                        {inquiryMutation.isPending ? t('contact.form.sending') : t('contact.form.submit')}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-light p-8 rounded-lg shadow-md h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-6 text-secondary font-condensed">{t('contact.info.title')}</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start">
                      <div className="icon-circle-sm">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary mb-1">{t('contact.info.addressTitle')}:</p>
                        <p className="text-dark-gray">{t('contact.info.address1')}</p>
                        <p className="text-dark-gray">{t('contact.info.address2')}</p>
                        <p className="text-dark-gray">{t('contact.info.address3')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="icon-circle-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary mb-1">{t('contact.info.phoneTitle')}:</p>
                        <p className="text-dark-gray">{t('contact.phone1')}</p>
                        <p className="text-dark-gray">{t('contact.phone2')}</p>
                        <p className="text-dark-gray">{t('contact.phone3')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="icon-circle-sm">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary mb-1">{t('contact.info.emailTitle')}:</p>
                        <p className="text-dark-gray">{t('contact.email')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="icon-circle-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-secondary mb-1">{t('contact.info.hoursTitle')}:</p>
                        <p className="text-dark-gray">{t('contact.hours.weekdays')}</p>
                        <p className="text-dark-gray">{t('contact.hours.saturday')}</p>
                        <p className="text-dark-gray">{t('contact.hours.sunday')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <GoogleMap
                    address={t('contact.info.address')} 
                    className="flex-grow min-h-[300px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-condensed">{t('cta.title')}</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#contact" className="btn-secondary">
                {t('cta.contactButton')}
              </a>
              <a href={`tel:${t('contact.phone1')}`} className="btn-outline">
                {t('cta.callButton')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
