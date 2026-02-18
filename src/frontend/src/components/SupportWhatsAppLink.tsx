import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportWhatsAppLinkProps {
  message?: string;
  variant?: 'ghost' | 'default' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export default function SupportWhatsAppLink({ 
  message, 
  variant = 'ghost', 
  size = 'sm',
  className = 'gap-2',
  showIcon = true,
  label = 'Contact Support'
}: SupportWhatsAppLinkProps) {
  const phoneNumber = '923280941320';
  const defaultMessage = 'Hello Ryk cart support, I need help with my order.';
  const finalMessage = encodeURIComponent(message || defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${finalMessage}`;

  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={className}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        {showIcon && <MessageCircle className="h-4 w-4" />}
        {label}
      </a>
    </Button>
  );
}
