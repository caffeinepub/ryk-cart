import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportWhatsAppLink() {
  const phoneNumber = '923280941320';
  const message = encodeURIComponent('Hello Ryk cart support, I need help with my order.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="gap-2"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        <span className="hidden md:inline">Support</span>
      </a>
    </Button>
  );
}
