import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Gift, Package, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import AccountSummary from './AccountSummary';
import SupportWhatsAppLink from '../SupportWhatsAppLink';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useIsAdmin } from '../../hooks/useQueries';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupDialog />
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/assets/generated/ryk-cart-logo.dim_512x512.png" 
                alt="Ryk cart" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold tracking-tight">Ryk cart</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Shop
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                  <Link to="/rewards" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    Rewards
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SupportWhatsAppLink />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/cart' })}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <AccountSummary />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About Ryk cart</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted online marketplace for quality products with rewards on every purchase.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
                {isAuthenticated && (
                  <>
                    <li><Link to="/orders" className="text-muted-foreground hover:text-foreground">My Orders</Link></li>
                    <li><Link to="/rewards" className="text-muted-foreground hover:text-foreground">Rewards</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://wa.me/923280941320?text=Hello%20Ryk%20cart%20support%2C%20I%20need%20help%20with%20my%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Rewards Program</h3>
              <p className="text-sm text-muted-foreground">
                Earn points with every purchase. Redeem at 20 points for cashback or mystery box!
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Ryk cart. Built with love using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
