import { useGetCart, usePlaceOrder } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import AuthGate from '../components/auth/AuthGate';

export default function CheckoutPage() {
  const { data: cart = [], isLoading } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter(item => item.product);

  const total = cartItems.reduce((sum, item) => {
    return sum + (Number(item.product!.price) * Number(item.quantity));
  }, 0);

  const pointsToEarn = cartItems.reduce((sum, item) => {
    const productPoints = Number(item.product!.points || 0);
    return sum + (productPoints * Number(item.quantity));
  }, 0);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (isLoading) {
    return (
      <AuthGate>
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Checkout</h1>
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGate>
    );
  }

  if (cartItems.length === 0) {
    return (
      <AuthGate>
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Checkout</h1>
            <Card>
              <CardContent className="py-16 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Add some products before checking out
                </p>
                <Button onClick={() => navigate({ to: '/' })}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.productId.toString()} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.product!.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {Number(item.quantity)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(Number(item.product!.price) * Number(item.quantity)).toFixed(2)}
                        </p>
                        {Number(item.product!.points || 0) > 0 && (
                          <p className="text-xs text-primary">
                            +{Number(item.product!.points) * Number(item.quantity)} pts
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                  {pointsToEarn > 0 && (
                    <div className="bg-primary/10 rounded-lg p-4 text-sm space-y-1">
                      <p className="font-semibold text-primary">Rewards</p>
                      <p className="text-muted-foreground">
                        You'll earn <span className="font-bold text-primary">{pointsToEarn} points</span> with this order
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Redeem 20 points for rewards
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending}
                  >
                    {placeOrder.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
