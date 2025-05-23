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
  EyeOff,
  Save,
  Copy,
  ArrowUp,
  ArrowDown,
  Settings,
  Code,
  Type,
  Palette
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ContentItem {
  id: number;
  key: string;
  title_ru: string | null;
  title_kk: string | null;
  content_ru: string | null;
  content_kk: string | null;
  section: string;
  order: number;
  isVisible: boolean;
  contentType: string;
  cssClasses: string | null;
  metadata: string | null;
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
  isVisible: boolean;
  contentType: string;
  cssClasses: string;
  metadata: string;
}

export default function ContentManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [formValues, setFormValues] = useState<ContentFormValues>({
    key: '',
    title_ru: '',
    title_kk: '',
    content_ru: '',
    content_kk: '',
    section: 'hero',
    order: 0,
    isVisible: true,
    contentType: 'text',
    cssClasses: '',
    metadata: '',
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (values: ContentFormValues) => 
      apiRequest('POST', '/api/contents', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Content Created Successfully",
        description: "New content has been added to your website",
      });
    },
    onError: () => {
      toast({
        title: "Error Creating Content",
        description: "Failed to create new content",
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<ContentFormValues> }) => 
      apiRequest('PUT', `/api/contents/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      toast({
        title: "Content Updated Successfully",
        description: "Website content has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error Updating Content",
        description: "Failed to update content",
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/contents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      toast({
        title: "Content Deleted Successfully",
        description: "Content has been removed from website",
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Content",
        description: "Failed to delete content",
        variant: 'destructive',
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: number; isVisible: boolean }) => 
      apiRequest('PUT', `/api/contents/${id}`, { isVisible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      toast({
        title: "Visibility Updated",
        description: "Content visibility has been changed",
      });
    },
  });

  // Duplicate content mutation
  const duplicateMutation = useMutation({
    mutationFn: (content: ContentItem) => {
      const newContent = {
        ...content,
        key: `${content.key}_copy`,
        order: content.order + 1,
      };
      delete (newContent as any).id;
      delete (newContent as any).updatedAt;
      return apiRequest('POST', '/api/contents', newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
      toast({
        title: "Content Duplicated",
        description: "Content has been duplicated successfully",
      });
    },
  });

  // Reorder content mutation
  const reorderMutation = useMutation({
    mutationFn: ({ id, newOrder }: { id: number; newOrder: number }) => 
      apiRequest('PUT', `/api/contents/${id}`, { order: newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contents'] });
    },
  });

  // Filter contents based on search and tab
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

  // Get unique sections for tabs
  const sections = Array.from(new Set(contents.map(item => item.section)));

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues({
      key: '',
      title_ru: '',
      title_kk: '',
      content_ru: '',
      content_kk: '',
      section: 'hero',
      order: 0,
      isVisible: true,
      contentType: 'text',
      cssClasses: '',
      metadata: '',
    });
  };

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
      isVisible: content.isVisible,
      contentType: content.contentType,
      cssClasses: content.cssClasses || '',
      metadata: content.metadata || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formValues);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContent) {
      updateMutation.mutate({ id: selectedContent.id, values: formValues });
    }
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  // Advanced action handlers
  const handleToggleVisibility = (content: ContentItem) => {
    toggleVisibilityMutation.mutate({ id: content.id, isVisible: !content.isVisible });
  };

  const handleDuplicate = (content: ContentItem) => {
    duplicateMutation.mutate(content);
  };

  const handleMoveUp = (content: ContentItem) => {
    if (content.order > 0) {
      reorderMutation.mutate({ id: content.id, newOrder: content.order - 1 });
    }
  };

  const handleMoveDown = (content: ContentItem) => {
    const maxOrder = Math.max(...contents.filter(c => c.section === content.section).map(c => c.order));
    if (content.order < maxOrder) {
      reorderMutation.mutate({ id: content.id, newOrder: content.order + 1 });
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold font-condensed">
                TPMS<span className="text-accent">Pro</span> <span className="text-sm ml-2">| Content Management</span>
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
                Dashboard
              </a>
            </Link>
            <Link href="/admin/content">
              <a className="flex items-center px-4 py-3 text-sm font-medium border-b-2 border-primary text-primary">
                <FileEdit className="w-4 h-4 mr-2" />
                Content Management
              </a>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary font-condensed">Website Content Editor</h1>
            <p className="text-gray-600 mt-2">Manage your bilingual website content</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4" />
                Add New Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Content Key *</Label>
                    <Input 
                      id="key" 
                      name="key" 
                      value={formValues.key} 
                      onChange={handleInputChange} 
                      placeholder="unique_key" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section *</Label>
                    <Select 
                      value={formValues.section} 
                      onValueChange={(value) => handleSelectChange('section', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="about">About Us</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input 
                    id="order" 
                    name="order" 
                    type="number" 
                    value={formValues.order} 
                    onChange={handleInputChange} 
                    min="0" 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Russian Content</h3>
                  <div className="space-y-2">
                    <Label htmlFor="title_ru">Title (Russian)</Label>
                    <Input 
                      id="title_ru" 
                      name="title_ru" 
                      value={formValues.title_ru} 
                      onChange={handleInputChange} 
                      placeholder="Title in Russian" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_ru">Content (Russian)</Label>
                    <Textarea 
                      id="content_ru" 
                      name="content_ru" 
                      value={formValues.content_ru} 
                      onChange={handleInputChange} 
                      placeholder="Content in Russian" 
                      rows={4} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Kazakh Content</h3>
                  <div className="space-y-2">
                    <Label htmlFor="title_kk">Title (Kazakh)</Label>
                    <Input 
                      id="title_kk" 
                      name="title_kk" 
                      value={formValues.title_kk} 
                      onChange={handleInputChange} 
                      placeholder="Title in Kazakh" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_kk">Content (Kazakh)</Label>
                    <Textarea 
                      id="content_kk" 
                      name="content_kk" 
                      value={formValues.content_kk} 
                      onChange={handleInputChange} 
                      placeholder="Content in Kazakh" 
                      rows={4} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Content'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content by key, title, or text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{contents.length}</div>
              <div className="text-sm text-gray-600">Total Content Items</div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Content ({contents.length})</TabsTrigger>
            {sections.map(section => (
              <TabsTrigger key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)} ({contents.filter(c => c.section === section).length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {activeTab === 'all' 
                      ? 'All Website Content' 
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content`}
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary">
                      {filteredContents.length} results for "{searchQuery}"
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <p>Loading content...</p>
                  </div>
                ) : filteredContents.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">
                      {searchQuery ? 'No matching content found' : 'No content found'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery 
                        ? 'Try adjusting your search terms' 
                        : 'Add some content to get started'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        Add New Content
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Key</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead>Russian Title</TableHead>
                          <TableHead>Kazakh Title</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContents.map((content) => (
                          <TableRow key={content.id} className={!content.isVisible ? 'opacity-50 bg-gray-50' : ''}>
                            {/* Status Column */}
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleVisibility(content)}
                                  className={content.isVisible ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}
                                >
                                  {content.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                <Badge variant={content.isVisible ? "default" : "secondary"}>
                                  {content.isVisible ? "Visible" : "Hidden"}
                                </Badge>
                              </div>
                            </TableCell>
                            
                            {/* Key Column */}
                            <TableCell className="font-mono text-sm">{content.key}</TableCell>
                            
                            {/* Section Column */}
                            <TableCell>
                              <Badge variant="outline">
                                {content.section}
                              </Badge>
                            </TableCell>
                            
                            {/* Content Type Column */}
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {content.contentType === 'html' && <Code className="h-3 w-3" />}
                                {content.contentType === 'markdown' && <Type className="h-3 w-3" />}
                                {content.contentType === 'text' && <Type className="h-3 w-3" />}
                                <span className="text-sm capitalize">{content.contentType}</span>
                              </div>
                            </TableCell>
                            
                            {/* Order Column */}
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">{content.order}</span>
                                <div className="flex flex-col space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMoveUp(content)}
                                    disabled={content.order === 0}
                                    className="h-4 w-4 p-0"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMoveDown(content)}
                                    className="h-4 w-4 p-0"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Russian Title Column */}
                            <TableCell className="max-w-xs">
                              <div className="truncate">
                                {content.title_ru || <span className="text-gray-400 italic">No title</span>}
                              </div>
                              {content.cssClasses && (
                                <div className="text-xs text-blue-600 font-mono mt-1">
                                  .{content.cssClasses}
                                </div>
                              )}
                            </TableCell>
                            
                            {/* Kazakh Title Column */}
                            <TableCell className="max-w-xs truncate">
                              {content.title_kk || <span className="text-gray-400 italic">No title</span>}
                            </TableCell>
                            
                            {/* Actions Column */}
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {/* Edit Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(content)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                {/* Duplicate Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDuplicate(content)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                
                                {/* Settings/Advanced Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(content)}
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                
                                {/* Delete Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(content.id)}
                                  className="text-red-600 hover:text-red-700"
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-key">Content Key *</Label>
                  <Input 
                    id="edit-key" 
                    name="key" 
                    value={formValues.key} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-section">Section *</Label>
                  <Select 
                    value={formValues.section} 
                    onValueChange={(value) => handleSelectChange('section', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="about">About Us</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-order">Display Order</Label>
                <Input 
                  id="edit-order" 
                  name="order" 
                  type="number" 
                  value={formValues.order} 
                  onChange={handleInputChange} 
                  min="0" 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Russian Content</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-title-ru">Title (Russian)</Label>
                  <Input 
                    id="edit-title-ru" 
                    name="title_ru" 
                    value={formValues.title_ru} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content-ru">Content (Russian)</Label>
                  <Textarea 
                    id="edit-content-ru" 
                    name="content_ru" 
                    value={formValues.content_ru} 
                    onChange={handleInputChange} 
                    rows={4} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Kazakh Content</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-title-kk">Title (Kazakh)</Label>
                  <Input 
                    id="edit-title-kk" 
                    name="title_kk" 
                    value={formValues.title_kk} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content-kk">Content (Kazakh)</Label>
                  <Textarea 
                    id="edit-content-kk" 
                    name="content_kk" 
                    value={formValues.content_kk} 
                    onChange={handleInputChange} 
                    rows={4} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}