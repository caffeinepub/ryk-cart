import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetPointsBalance } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, Package, Gift, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AccountSummary() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: points } = useGetPointsBalance();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    sessionStorage.removeItem('ryk_admin_unlocked');
    navigate({ to: '/' });
  };

  const pointsNumber = points ? Number(points) : 0;
  const canRedeem = pointsNumber >= 20;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
          {canRedeem && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground flex items-center gap-2">
              {pointsNumber} points
              {canRedeem && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  Redeemable
                </Badge>
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/orders' })}>
          <Package className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/rewards' })}>
          <Gift className="mr-2 h-4 w-4" />
          <span>Rewards</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
