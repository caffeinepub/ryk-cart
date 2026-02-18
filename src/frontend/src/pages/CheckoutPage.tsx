import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, usePlaceOrder } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const placeOrder = usePlaceOrder();

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

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const isLoading = cartLoading || productsLoading;

  return (
    <AuthGate message="Please login to checkout">
      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/cart' })} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {isLoading ? (
          <Skeleton className="h-96 w-full" />
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartWithProducts.map(item => (
                  <div key={item.productId.toString()} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.product?.imageUrls[0] ? (
                        <img 
                          src={item.product.imageUrls[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {Number(item.quantity)}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">${Number(item.product?.price) * Number(item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">${Number(item.product?.price)} each</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>

                <Card className="bg-accent/50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-1">Rewards</p>
                    <p className="text-sm text-muted-foreground">
                      You'll earn <span className="font-bold text-primary">{totalPoints} points</span> with this order!
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending}
                >
                  {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
