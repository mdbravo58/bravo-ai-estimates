import { useMemo, useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  searchFields?: (keyof T)[];
  placeholder?: string;
  className?: string;
}

function VirtualizedList<T extends Record<string, any>>({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  searchFields = [],
  placeholder = "Search...",
  className 
}: VirtualizedListProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim() || searchFields.length === 0) {
      return items;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && 
               typeof value === 'string' && 
               value.toLowerCase().includes(lowercaseSearch);
      })
    );
  }, [items, searchTerm, searchFields]);

  // Memoized row renderer to prevent unnecessary re-renders
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredItems[index];
    if (!item) return null;

    return (
      <div style={style}>
        {renderItem(item, index)}
      </div>
    );
  }, [filteredItems, renderItem]);

  return (
    <div className={className}>
      {searchFields.length > 0 && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      
      <Card className="overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? "No items found matching your search." : "No items to display."}
          </div>
        ) : (
          <List
            height={containerHeight}
            itemCount={filteredItems.length}
            itemSize={itemHeight}
            overscanCount={5} // Render 5 extra items for smoother scrolling
          >
            {Row}
          </List>
        )}
      </Card>
    </div>
  );
}

export default VirtualizedList;