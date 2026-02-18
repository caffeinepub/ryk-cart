import { useState } from 'react';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useToggleProductActive } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Power, Loader2, HelpCircle, PackageOpen } from 'lucide-react';
import AdminGate from '../components/auth/AdminGate';
import { toast } from 'sonner';
import type { Product } from '../backend';

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  imageUrls: string;
}

export default function AdminProductsPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const toggleActive = useToggleProductActive();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrls: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      imageUrls: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      imageUrls: product.imageUrls.join('\n'),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const imageUrlsArray = formData.imageUrls.split('\n').map(url => url.trim()).filter(url => url);
      
      if (editingProduct) {
        await updateProduct.mutateAsync({
          productId: editingProduct.id,
          name: formData.name,
          price: BigInt(formData.price),
          description: formData.description,
          category: formData.category,
          stock: BigInt(formData.stock),
          imageUrls: imageUrlsArray,
          isActive: editingProduct.isActive,
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync({
          name: formData.name,
          price: BigInt(formData.price),
          description: formData.description,
          category: formData.category,
          stock: BigInt(formData.stock),
          imageUrls: imageUrlsArray,
        });
        toast.success('Product created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleToggleActive = async (productId: bigint) => {
    try {
      await toggleActive.mutateAsync(productId);
      toast.success('Product status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product status');
    }
  };

  return (
    <AdminGate>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Product Management</h1>
          <div className="flex gap-2">
            <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>How to Add Products</DialogTitle>
                  <DialogDescription>
                    Quick guide to managing your product catalog
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Alert>
                    <PackageOpen className="h-4 w-4" />
                    <AlertTitle>Getting Started</AlertTitle>
                    <AlertDescription>
                      You are currently on the Admin page at <code className="text-xs bg-muted px-1 py-0.5 rounded">/admin</code>. 
                      Use the "Add Product" button to create your first product.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Minimum Required Fields:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Name:</span>
                        <span>Product title (e.g., "Wireless Headphones")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Price:</span>
                        <span>Product price in dollars (e.g., 49)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Category:</span>
                        <span>Product category (e.g., "Electronics")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Stock:</span>
                        <span>Available quantity (e.g., 100)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Description:</span>
                        <span>Brief product description</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-24">Image URLs:</span>
                        <span><strong>Optional.</strong> Enter one URL per line. Leave blank if no images.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Alert variant="default">
                    <AlertDescription className="text-sm">
                      <strong>Tip:</strong> New products are automatically set to "Active" and will appear in the catalog immediately.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsHelpOpen(false)}>Got it</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Update product details' : 'Add a new product to your store'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrls">Image URLs (one per line, optional)</Label>
                    <Textarea
                      id="imageUrls"
                      value={formData.imageUrls}
                      onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                      rows={4}
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={createProduct.isPending || updateProduct.isPending}>
                    {(createProduct.isPending || updateProduct.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12">
                <PackageOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click "Add Product" to create your first product.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id.toString()}>
                      <TableCell>{product.id.toString()}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="capitalize">{product.category}</TableCell>
                      <TableCell>${Number(product.price)}</TableCell>
                      <TableCell>{Number(product.stock)}</TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'secondary' : 'outline'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(product.id)}
                            disabled={toggleActive.isPending}
                          >
                            <Power className={`h-4 w-4 ${product.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGate>
  );
}
