import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function OrderHistoryPage() {
  return (
    <AuthGate message="Please login to view your order history">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>

        <Alert>
          <Package className="h-4 w-4" />
          <AlertTitle>Order History Coming Soon</AlertTitle>
          <AlertDescription>
            The order history feature is currently being developed. Your orders are being tracked and will be available here soon.
          </AlertDescription>
        </Alert>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Order history will be displayed here once the backend API is available.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
