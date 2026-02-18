import { ReactNode, useState } from 'react';
import { useIsAdmin, useGetCallerPrincipal, useCheckBootstrapAvailable, useClaimAdminBootstrap } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, LogIn, Loader2, Copy, Check, AlertCircle, CheckCircle2, Bug } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import SupportWhatsAppLink from '../SupportWhatsAppLink';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: callerPrincipal, isLoading: principalLoading } = useGetCallerPrincipal();
  const { data: bootstrapAvailable, isLoading: bootstrapLoading } = useCheckBootstrapAvailable();
  const claimAdminMutation = useClaimAdminBootstrap();
  
  const [copied, setCopied] = useState(false);
  const [bootstrapPassword, setBootstrapPassword] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [lastBootstrapError, setLastBootstrapError] = useState<string | null>(null);
  
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleCopyPrincipal = () => {
    if (callerPrincipal) {
      navigator.clipboard.writeText(callerPrincipal);
      setCopied(true);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setLastBootstrapError(null);
    claimAdminMutation.mutate(
      { password: bootstrapPassword },
      {
        onSuccess: () => {
          toast.success('Admin access claimed successfully!');
          setBootstrapPassword('');
          setClaimSuccess(true);
          setLastBootstrapError(null);
        },
        onError: (error: any) => {
          const errorMessage = error.message || 'Failed to claim admin access';
          setLastBootstrapError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  // Debug panel component (only shown in gating flows)
  const DebugPanel = () => (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Bug className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium">Self-Check Debug Info</h4>
      </div>
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Authenticated:</span>
          <span className={isAuthenticated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {isAuthenticated ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Is Admin:</span>
          <span className={isAdmin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {isAdminLoading ? 'Loading...' : isAdmin ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bootstrap Available:</span>
          <span className={bootstrapAvailable ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
            {bootstrapLoading ? 'Loading...' : bootstrapAvailable ? 'Yes' : 'No'}
          </span>
        </div>
        {lastBootstrapError && (
          <div className="pt-2 border-t border-border">
            <span className="text-muted-foreground">Last Bootstrap Error:</span>
            <div className="mt-1 text-red-600 dark:text-red-400 break-words">
              {lastBootstrapError}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading skeleton while checking authentication and admin status
  if (isAdminLoading || (isAuthenticated && (bootstrapLoading || principalLoading))) {
    return (
      <div className="container py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Step 1: Require Internet Identity authentication first
  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in with Internet Identity to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={login} disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoggingIn ? 'Logging in...' : 'Log In with Internet Identity'}
            </Button>
          </CardContent>
          <CardContent>
            <DebugPanel />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Check if authenticated user is an admin
  if (!isAdmin) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Your account is not configured as an administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Principal Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Principal ID</Label>
              <div className="flex gap-2">
                <Input
                  value={principalLoading ? 'Loading...' : callerPrincipal || ''}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPrincipal}
                  disabled={principalLoading || !callerPrincipal}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this ID with the system administrator to request access
              </p>
            </div>

            {/* Bootstrap Availability Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bootstrap Status</Label>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Bootstrap available:</span>
                <span className="font-medium">
                  {bootstrapLoading ? (
                    <Loader2 className="h-4 w-4 inline animate-spin" />
                  ) : bootstrapAvailable ? (
                    <span className="text-green-600 dark:text-green-400">Yes</span>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </span>
              </div>
            </div>

            {/* Success State */}
            {claimSuccess && (
              <Alert className="border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Admin access claimed successfully! The page should update automatically.
                </AlertDescription>
              </Alert>
            )}

            {/* Error State */}
            {lastBootstrapError && !claimSuccess && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {lastBootstrapError}
                </AlertDescription>
              </Alert>
            )}

            {/* Bootstrap Claim or Support Contact */}
            {bootstrapAvailable && !claimSuccess ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No admin has been configured yet. You can claim admin access by entering the password.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleClaimAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bootstrap-password">Admin Password</Label>
                    <Input
                      id="bootstrap-password"
                      type="password"
                      value={bootstrapPassword}
                      onChange={(e) => setBootstrapPassword(e.target.value)}
                      placeholder="Enter admin password"
                      disabled={claimAdminMutation.isPending}
                      autoComplete="current-password"
                      autoFocus
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={claimAdminMutation.isPending || !bootstrapPassword}
                  >
                    {claimAdminMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Claim Admin Access
                  </Button>
                </form>
              </div>
            ) : !claimSuccess ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    An administrator has already been configured. Please contact support to request admin access.
                  </AlertDescription>
                </Alert>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Need help? Contact our support team via WhatsApp:
                  </p>
                  <SupportWhatsAppLink
                    message={`Hello, I need admin access to the Ryk cart admin panel. My Principal ID is: ${callerPrincipal || '[loading...]'}`}
                    variant="default"
                    size="default"
                    className="w-full"
                    label="WhatsApp Support"
                  />
                </div>
              </div>
            ) : null}

            {/* Troubleshooting */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Troubleshooting</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure you're logged in with the correct Internet Identity</li>
                <li>If you should have admin access, contact the system administrator</li>
                <li>Try logging out and logging back in</li>
              </ul>
            </div>

            {/* Debug Panel */}
            <DebugPanel />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: User is authenticated and is an admin - render children (AdminPage will handle password unlock)
  return <>{children}</>;
}
