import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart.mutateAsync({ productId: BigInt(productId), quantity: BigInt(quantity) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;
  const maxQuantity = Math.min(Number(product.stock), 10);

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.imageUrls.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="p-0">
                        <img 
                          src={url} 
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.imageUrls.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          ) : (
            <Card>
              <CardContent className="p-0 h-96 flex items-center justify-center bg-muted rounded-lg">
                <ShoppingCart className="h-24 w-24 text-muted-foreground" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-4">${Number(product.price)}</p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Stock:</span>
              {inStock ? (
                <Badge variant="secondary">{Number(product.stock)} available</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {inStock && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock || addToCart.isPending}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Earn Rewards!</h3>
              <p className="text-sm text-muted-foreground">
                You'll earn {Math.floor(Number(product.price) * quantity / 100)} points with this purchase. 
                Collect 20 points to redeem for cashback or a mystery box!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
