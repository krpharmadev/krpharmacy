import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  onRemove: (productId: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isLoading 
}: CartItemProps) {
  const handleIncrementQuantity = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };
  
  const handleDecrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };
  
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(item.productId, value);
    }
  };
  
  const handleRemove = () => {
    onRemove(item.productId);
  };
  
  const subtotal = item.price * item.quantity;
  
  return (
    <div className="flex py-4 border-b">
      <div className="w-20 h-20 rounded overflow-hidden relative flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-400">ไม่มีรูปภาพ</span>
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <div className="text-sm text-gray-500 mt-1">
          ราคา: ฿{item.price.toLocaleString()}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrementQuantity}
              disabled={isLoading || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleChangeQuantity}
              className="w-12 h-8 mx-1 text-center"
              disabled={isLoading}
            />
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrementQuantity}
              disabled={isLoading}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="font-medium">
              ฿{subtotal.toLocaleString()}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 