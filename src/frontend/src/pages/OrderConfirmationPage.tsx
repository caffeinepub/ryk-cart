import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Gift, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Thank you for your purchase! Your order has been confirmed and your loyalty points have been added to your account.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-accent/50">
              <CardContent className="pt-6 text-center">
                <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Rewards Earned</h3>
                <p className="text-sm text-muted-foreground">
                  Check your rewards page to see your updated points balance!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/50">
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Order History</h3>
                <p className="text-sm text-muted-foreground">
                  View all your orders in the order history section.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="flex-1">
            Continue Shopping
          </Button>
          <Button onClick={() => navigate({ to: '/rewards' })} className="flex-1">
            View Rewards
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
