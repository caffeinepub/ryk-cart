import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useAddToCart, useRemoveFromCart } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const cartWithProducts = useMemo(() => {
    if (!cartItems || !products) return [];
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
    }).filter(item => item.product);
  }, [cartItems, products]);

  const total = useMemo(() => {
    return cartWithProducts.reduce((sum, item) => {
      return sum + (Number(item.product?.price || 0) * Number(item.quantity));
    }, 0);
  }, [cartWithProducts]);

  const totalPoints = Math.floor(total / 100);

  const handleUpdateQuantity = async (productId: bigint, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(newQuantity) });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const isLoading = cartLoading || productsLoading;

  return (
    <AuthGate message="Please login to view your cart">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        ) : cartWithProducts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started!</p>
              <Button onClick={() => navigate({ to: '/' })}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartWithProducts.map(item => (
                <Card key={item.productId.toString()}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.product?.imageUrls[0] ? (
                          <img 
                            src={item.product.imageUrls[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.product?.category}</p>
                        <p className="text-xl font-bold text-primary">${Number(item.product?.price)}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.productId)}
                          disabled={removeFromCart.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, Number(item.quantity) - 1)}
                            disabled={Number(item.quantity) <= 1 || addToCart.isPending}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{Number(item.quantity)}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, Number(item.quantity) + 1)}
                            disabled={addToCart.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{cartWithProducts.length}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>

                  <Card className="bg-accent/50">
                    <CardContent className="pt-4">
                      <p className="text-sm">
                        You'll earn <span className="font-bold text-primary">{totalPoints} points</span> with this order!
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate({ to: '/checkout' })}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
