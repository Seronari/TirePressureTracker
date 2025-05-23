import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  AlertCircle,
  FileEdit, 
  LayoutDashboard,
  Search,
  Eye,
  Copy,
  Save,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Types for content items
interface ContentItem {
  id: number;
  key: string;
  title_ru: string | null;
  title_kk: string | null;
  content_ru: string | null;
  content_kk: string | null;
  section: string;
  order: number;
  updatedAt: string;
}

interface ContentFormValues {
  key: string;
  title_ru: string;
  title_kk: string;
  content_ru: string;
  content_kk: string;
  section: string;
  order: number;
}

export default function ContentManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const [formValues, setFormValues] = useState<ContentFormValues>({
    key: '',
    title_ru: '',
    title_kk: '',
    content_ru: '',
    content_kk: '',
    section: 'hero',
    order: 0,
  });

  // Get all content items
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['/api/contents'],
    select: (data: ContentItem[]) => data.sort((a, b) => 
      a.section === b.section 
        ? a.order - b.order 
        : a.section.localeCompare(b.section)
    ),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (values: ContentFormValues) => 
      apiRequest('POST', '/api/contents', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: t('Content created successfully'),
        description: t('The new content has been added to the website'),
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: t('Error creating content'),
        description: error.message || t('An error occurred while creating the content'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<ContentFormValues> }) => 
      apiRequest('PUT', `/api/contents/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      toast({
        title: t('Content updated successfully'),
        description: t('The content has been updated on the website'),
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: t('Error updating content'),
        description: error.message || t('An error occurred while updating the content'),
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/contents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      toast({
        title: t('Content deleted successfully'),
        description: t('The content has been removed from the website'),
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: t('Error deleting content'),
        description: error.message || t('An error occurred while deleting the content'),
        variant: 'destructive',
      });
    },
  });

  // Filter contents based on active tab and search query
  const filteredContents = contents
    .filter(item => activeTab === 'all' || item.section === activeTab)
    .filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.key.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query) ||
        (item.title_ru && item.title_ru.toLowerCase().includes(query)) ||
        (item.title_kk && item.title_kk.toLowerCase().includes(query)) ||
        (item.content_ru && item.content_ru.toLowerCase().includes(query)) ||
        (item.content_kk && item.content_kk.toLowerCase().includes(query))
      );
    });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Reset form values
  const resetForm = () => {
    setFormValues({
      key: '',
      title_ru: '',
      title_kk: '',
      content_ru: '',
      content_kk: '',
      section: 'hero',
      order: 0,
    });
  };

  // Open edit dialog with content data
  const handleEditClick = (content: ContentItem) => {
    setSelectedContent(content);
    setFormValues({
      key: content.key,
      title_ru: content.title_ru || '',
      title_kk: content.title_kk || '',
      content_ru: content.content_ru || '',
      content_kk: content.content_kk || '',
      section: content.section,
      order: content.order,
    });
    setIsEditDialogOpen(true);
  };

  // Handle form submission for create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formValues);
  };

  // Handle form submission for update
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContent) {
      updateMutation.mutate({ id: selectedContent.id, values: formValues });
    }
  };

  // Handle delete button click
  const handleDeleteClick = (id: number) => {
    if (window.confirm(t('Are you sure you want to delete this content? This action cannot be undone.'))) {
      deleteMutation.mutate(id);
    }
  };

  // Get unique sections for tabs
  const sections = Array.from(new Set(contents.map(item => item.section)));

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold font-condensed">
                TPMS<span className="text-accent">Pro</span> <span className="text-sm ml-2">| {t('Content Management')}</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto">
            <Link href="/admin/dashboard">
              <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:border-b-2 hover:border-primary transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {t('Dashboard')}
              </a>
            </Link>
            <Link href="/admin/content">
              <a className="flex items-center px-4 py-3 text-sm font-medium border-b-2 border-primary text-primary">
                <FileEdit className="w-4 h-4 mr-2" />
                {t('Content Management')}
              </a>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('Website Content Editor')}</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                {t('Add New Content')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('Add New Content')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">{t('Key')} *</Label>
                    <Input 
                      id="key" 
                      name="key" 
                      value={formValues.key} 
                      onChange={handleInputChange} 
                      placeholder="unique_key" 
                      required 
                    />
                    <p className="text-xs text-muted-foreground">{t('A unique identifier for this content')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">{t('Section')} *</Label>
                    <Select 
                      value={formValues.section} 
                      onValueChange={(value) => handleSelectChange('section', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select section')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">{t('Hero')}</SelectItem>
                        <SelectItem value="about">{t('About Us')}</SelectItem>
                        <SelectItem value="products">{t('Products')}</SelectItem>
                        <SelectItem value="services">{t('Services')}</SelectItem>
                        <SelectItem value="contact">{t('Contact')}</SelectItem>
                        <SelectItem value="footer">{t('Footer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">{t('Display Order')} *</Label>
                    <Input 
                      id="order" 
                      name="order" 
                      type="number" 
                      value={formValues.order} 
                      onChange={handleInputChange} 
                      min="0" 
                      required 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="title_ru">{t('Title (Russian)')}</Label>
                  <Input 
                    id="title_ru" 
                    name="title_ru" 
                    value={formValues.title_ru} 
                    onChange={handleInputChange} 
                    placeholder={t('Title in Russian')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content_ru">{t('Content (Russian)')}</Label>
                  <Textarea 
                    id="content_ru" 
                    name="content_ru" 
                    value={formValues.content_ru} 
                    onChange={handleInputChange} 
                    placeholder={t('Content in Russian')} 
                    rows={4} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="title_kk">{t('Title (Kazakh)')}</Label>
                  <Input 
                    id="title_kk" 
                    name="title_kk" 
                    value={formValues.title_kk} 
                    onChange={handleInputChange} 
                    placeholder={t('Title in Kazakh')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content_kk">{t('Content (Kazakh)')}</Label>
                  <Textarea 
                    id="content_kk" 
                    name="content_kk" 
                    value={formValues.content_kk} 
                    onChange={handleInputChange} 
                    placeholder={t('Content in Kazakh')} 
                    rows={4} 
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? t('Creating...') : t('Create Content')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>

          {/* Search and Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('Search content by key, title, or text...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{contents.length}</div>
                <div className="text-sm text-gray-600">{t('Total Content Items')}</div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">{t('All Content')}</TabsTrigger>
            {sections.map(section => (
              <TabsTrigger key={section} value={section}>
                {t(section.charAt(0).toUpperCase() + section.slice(1))}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' 
                    ? t('All Website Content') 
                    : t('{{section}} Content', { section: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <p>{t('Loading content...')}</p>
                  </div>
                ) : filteredContents.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">{t('No content found')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === 'all' 
                        ? t('There is no content in the database. Add some content to get started.') 
                        : t('There is no content in this section. Add some content to this section.')}
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      {t('Add New Content')}
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('Key')}</TableHead>
                          <TableHead>{t('Section')}</TableHead>
                          <TableHead>{t('Order')}</TableHead>
                          <TableHead>{t('Russian Title')}</TableHead>
                          <TableHead>{t('Kazakh Title')}</TableHead>
                          <TableHead>{t('Last Updated')}</TableHead>
                          <TableHead>{t('Actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContents.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell className="font-medium">{content.key}</TableCell>
                            <TableCell>{content.section}</TableCell>
                            <TableCell>{content.order}</TableCell>
                            <TableCell>{content.title_ru || '-'}</TableCell>
                            <TableCell>{content.title_kk || '-'}</TableCell>
                            <TableCell>
                              {new Date(content.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditClick(content)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteClick(content.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('Edit Content')}</DialogTitle>
            </DialogHeader>
            {selectedContent && (
              <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-key">{t('Key')} *</Label>
                    <Input 
                      id="edit-key" 
                      name="key" 
                      value={formValues.key} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-section">{t('Section')} *</Label>
                    <Select 
                      value={formValues.section} 
                      onValueChange={(value) => handleSelectChange('section', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select section')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">{t('Hero')}</SelectItem>
                        <SelectItem value="about">{t('About Us')}</SelectItem>
                        <SelectItem value="products">{t('Products')}</SelectItem>
                        <SelectItem value="services">{t('Services')}</SelectItem>
                        <SelectItem value="contact">{t('Contact')}</SelectItem>
                        <SelectItem value="footer">{t('Footer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-order">{t('Display Order')} *</Label>
                    <Input 
                      id="edit-order" 
                      name="order" 
                      type="number" 
                      value={formValues.order} 
                      onChange={handleInputChange} 
                      min="0" 
                      required 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title_ru">{t('Title (Russian)')}</Label>
                  <Input 
                    id="edit-title_ru" 
                    name="title_ru" 
                    value={formValues.title_ru} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-content_ru">{t('Content (Russian)')}</Label>
                  <Textarea 
                    id="edit-content_ru" 
                    name="content_ru" 
                    value={formValues.content_ru} 
                    onChange={handleInputChange} 
                    rows={4} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title_kk">{t('Title (Kazakh)')}</Label>
                  <Input 
                    id="edit-title_kk" 
                    name="title_kk" 
                    value={formValues.title_kk} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-content_kk">{t('Content (Kazakh)')}</Label>
                  <Textarea 
                    id="edit-content_kk" 
                    name="content_kk" 
                    value={formValues.content_kk} 
                    onChange={handleInputChange} 
                    rows={4} 
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? t('Updating...') : t('Update Content')}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}