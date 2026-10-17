import { type Listing } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ items }: { items: Listing[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
