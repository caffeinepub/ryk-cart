import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ShoppingCart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetAllProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeProducts = useMemo(() => {
    return (products || []).filter(p => p.isActive);
  }, [products]);

  const categories = useMemo(() => {
    const cats = new Set(activeProducts.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeProducts, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
        <img 
          src="/assets/generated/ryk-cart-hero.dim_1600x600.png" 
          alt="Shop at Ryk cart" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
          <div className="container pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to Ryk cart</h1>
            <p className="text-lg text-muted-foreground">Discover quality products and earn rewards with every purchase</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Products' : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id.toString()} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div 
                    className="relative h-48 overflow-hidden rounded-t-lg bg-muted"
                    onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
                  >
                    {product.imageUrls.length > 0 ? (
                      <img 
                        src={product.imageUrls[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {Number(product.stock) === 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4" onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}>
                  <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${Number(product.price)}</span>
                    <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
                    disabled={Number(product.stock) === 0}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
