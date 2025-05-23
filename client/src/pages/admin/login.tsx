import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { loginFormSchema, type LoginFormValues } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, User, KeyRound } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await login(values.username, values.password);
      if (user.isAdmin) {
        toast({
          title: t('admin.login.successTitle'),
          description: t('admin.login.successMessage'),
        });
        setLocation('/admin/dashboard');
      } else {
        toast({
          title: t('admin.login.notAdminTitle'),
          description: t('admin.login.notAdminMessage'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('admin.login.errorTitle'),
        description: t('admin.login.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-condensed">
            Far<span className="text-accent">sensor</span>
          </h1>
          <p className="text-secondary mt-2">{t('admin.login.subtitle')}</p>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-xl text-center">{t('admin.login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.login.usernameLabel')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            className="pl-10" 
                            placeholder={t('admin.login.usernamePlaceholder')}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.login.passwordLabel')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            type="password" 
                            className="pl-10" 
                            placeholder={t('admin.login.passwordPlaceholder')}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                  {isLoading ? t('admin.login.loggingIn') : t('admin.login.loginButton')}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <a href="/" className="text-sm text-primary hover:text-accent transition-colors duration-300">
                {t('admin.login.backToSite')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
