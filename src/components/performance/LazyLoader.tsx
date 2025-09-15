import { Suspense, lazy, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyLoaderProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  retryCount?: number;
}

// Cache for loaded components to prevent re-imports
const componentCache = new Map();

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  importFunc, 
  fallback,
  retryCount = 3 
}) => {
  const cacheKey = importFunc.toString();
  
  if (!componentCache.has(cacheKey)) {
    const LazyComponent = lazy(() => {
      return retryImport(importFunc, retryCount);
    });
    componentCache.set(cacheKey, LazyComponent);
  }

  const LazyComponent = componentCache.get(cacheKey);

  const defaultFallback = (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Retry mechanism for failed imports
const retryImport = async (importFunc: () => Promise<{ default: ComponentType<any> }>, retries: number): Promise<{ default: ComponentType<any> }> => {
  try {
    return await importFunc();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Import failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryImport(importFunc, retries - 1);
    }
    throw error;
  }
};

export default LazyLoader;