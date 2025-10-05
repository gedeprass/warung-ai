import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  stock: number;
  onProductClick?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  stock,
  onProductClick
}: ProductCardProps) {
  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(id.toString());
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80`;
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        {stock > 0 && stock <= 10 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Only {stock} left!
          </Badge>
        )}
        {stock > 10 && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            In Stock
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">4.5</span>
          </div>
          <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
            ${price}
          </div>
        </div>

        <Button
          onClick={handleProductClick}
          className="w-full"
          disabled={stock === 0}
        >
          {stock === 0 ? "Out of Stock" : "View Details"}
        </Button>
      </div>
    </Card>
  );
}