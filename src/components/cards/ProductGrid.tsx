import { type Listing } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ items }: { items: Listing[] }) {
  return (
    <div className="items-grid grid grid-cols-4 gap-[1.2rem] max-[900px]:grid-cols-2">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
