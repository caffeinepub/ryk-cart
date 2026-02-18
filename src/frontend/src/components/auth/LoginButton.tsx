import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <Button
      onClick={login}
      disabled={isLoggingIn}
      className="gap-2"
    >
      {isLoggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoggingIn ? 'Logging in...' : 'Login'}
    </Button>
  );
}
