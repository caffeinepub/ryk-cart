import { useGetCart, useRemoveFromCart } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import AuthGate from '../components/auth/AuthGate';

export default function CartPage() {
  const { data: cart = [], isLoading } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const removeFromCart = useRemoveFromCart();
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

  const handleRemove = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate({ to: '/checkout' });
  };

  if (isLoading) {
    return (
      <AuthGate>
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading cart...</p>
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
            <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Add some products to get started
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
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.productId.toString()}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {item.product!.imageUrls.length > 0 && (
                        <img
                          src={item.product!.imageUrls[0]}
                          alt={item.product!.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.product!.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 capitalize">
                          {item.product!.category}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold">
                            ${Number(item.product!.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {Number(item.quantity)}
                          </p>
                          {Number(item.product!.points || 0) > 0 && (
                            <p className="text-sm text-primary">
                              +{Number(item.product!.points) * Number(item.quantity)} points
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.productId)}
                        disabled={removeFromCart.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
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
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      <p className="text-primary font-medium">
                        You'll earn {pointsToEarn} loyalty points with this order!
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
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
