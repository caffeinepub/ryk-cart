import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, DollarSign, Package } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { useGetPointsBalance, useRedeemPoints } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RewardsPage() {
  const { data: points, isLoading } = useGetPointsBalance();
  const redeemPoints = useRedeemPoints();

  const pointsNumber = Number(points || 0);
  const canRedeem = pointsNumber >= 20;
  const pointsNeeded = Math.max(0, 20 - pointsNumber);

  const handleRedeem = async (type: 'cashback' | 'mysteryBox') => {
    try {
      if (type === 'cashback') {
        await redeemPoints.mutateAsync({ __kind__: 'cashback', cashback: BigInt(100) });
        toast.success('Cashback redeemed successfully!');
      } else {
        await redeemPoints.mutateAsync({ __kind__: 'mysteryBox', mysteryBox: 'Mystery Box Gift' });
        toast.success('Mystery Box redeemed successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem points');
    }
  };

  return (
    <AuthGate message="Please login to view your rewards">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Loyalty Rewards</h1>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="text-3xl">Your Points Balance</CardTitle>
                <CardDescription>Earn 1 point for every $1 spent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-primary">{pointsNumber}</span>
                  <span className="text-2xl text-muted-foreground">points</span>
                </div>
                {!canRedeem && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    You need {pointsNeeded} more points to redeem rewards
                  </p>
                )}
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4">Redeem Your Points</h2>
              <p className="text-muted-foreground mb-6">
                Collect 20 points to unlock exclusive rewards! Choose between cashback or a mystery box gift.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className={!canRedeem ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Cashback Reward</CardTitle>
                    <CardDescription>Get $1 cashback on your next purchase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">20 points required</Badge>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={!canRedeem || redeemPoints.isPending}
                      onClick={() => handleRedeem('cashback')}
                    >
                      {canRedeem ? 'Redeem Cashback' : `Need ${pointsNeeded} more points`}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className={!canRedeem ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Mystery Box</CardTitle>
                    <CardDescription>Receive a surprise gift with your next order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">20 points required</Badge>
                    <div className="mt-4">
                      <img 
                        src="/assets/generated/ryk-cart-mystery-box.dim_800x800.png" 
                        alt="Mystery Box" 
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={!canRedeem || redeemPoints.isPending}
                      onClick={() => handleRedeem('mysteryBox')}
                    >
                      {canRedeem ? 'Redeem Mystery Box' : `Need ${pointsNeeded} more points`}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Redemption History</h2>
              <Alert>
                <Package className="h-4 w-4" />
                <AlertTitle>History Coming Soon</AlertTitle>
                <AlertDescription>
                  Your redemption history is being tracked and will be displayed here soon.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
