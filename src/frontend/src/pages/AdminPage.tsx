import { useState } from 'react';
import { useAdminUnlock } from '../hooks/useAdminUnlock';
import AdminProductsPage from './AdminProductsPage';
import AdminGate from '../components/auth/AdminGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { isUnlocked, isChecking, unlock } = useAdminUnlock();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const success = unlock(password);
      if (success) {
        toast.success('Admin panel unlocked');
        setPassword('');
      } else {
        toast.error('Incorrect password. Please try again.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <AdminGate>
      {isChecking ? (
        <div className="container max-w-md mx-auto py-16">
          <Card>
            <CardContent className="pt-6 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      ) : !isUnlocked ? (
        <div className="container max-w-md mx-auto py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Enter your password to access the product management panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || !password}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Unlock Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <AdminProductsPage />
      )}
    </AdminGate>
  );
}
