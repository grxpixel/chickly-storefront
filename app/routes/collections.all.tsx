import {useLoaderData, useFetcher, Await} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState, useCallback} from 'react'; 
import { collectionsLoader } from '~/components/CollectionPage/Loaders/collectionsLoader'; 
import Filters from '~/components/CollectionPage/Filters/Filters';
import Sort from '~/components/CollectionPage/Sort/Sort';
import ProductCard from '~/components/CollectionPage/Product/ProductCard';
import LoadingSpinner from '~/components/CollectionPage/Product/LoadingSpinner';

export const loader = collectionsLoader;
export const meta = () => [{title: 'All Products'}];

export default function CollectionsAllPage() {
  const {products, discountFilters, searchParams} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const observer = useRef<IntersectionObserver>();
  const [extraItems, setExtraItems] = useState<any[]>([]);

  const lastElement = useCallback((node: Element | null, pageInfo?: any) => {
    if (fetcher.state !== "idle") return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pageInfo?.hasNextPage) {
        const params = new URLSearchParams(searchParams);
        params.set('after', pageInfo.endCursor);
        fetcher.load(`?${params.toString()}`);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetcher, searchParams]);

  useEffect(() => {
    const data = fetcher.data as any;
    if (data?.products?.products?.nodes?.length > 0) {
      setExtraItems(prev => [...prev, ...data.products.products.nodes]);
    }
  }, [fetcher.data]);

  const calculateDiscount = (compareAt: number, price: number) => {
    if (!compareAt || compareAt <= price) return 0;
    return Math.round(((compareAt - price) / compareAt) * 100);
  };

  return (
    <div className="max-w-screen mx-auto px-14 py-10 flex gap-8">
      <div className="w-72 sticky top-24 h-fit flex-col">
        <Filters />
      </div>

      <div className="flex-1">
        <div className="flex justify-end mb-6">
          <Sort />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <Await resolve={products}>
            {(data: any) => {
              // ✅ Filtering inside Await (recommended)
              const allItems = [...data.products.nodes, ...extraItems];

              const finalFilteredProducts = allItems.filter((product: any) => {
                const variant = product.variants.nodes[0];
                const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
                const compareAt = variant?.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : 0;
                const discountValue = calculateDiscount(compareAt, minPrice);

                if (discountFilters?.length) {
                  const discountMatch = discountFilters.some((d: string) => discountValue >= parseInt(d));
                  if (!discountMatch) return false;
                }

                return true;
              });

              return (
                <>
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {finalFilteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {data.products.pageInfo?.hasNextPage && (
                    <div ref={(node) => lastElement(node, data.products.pageInfo)} className="flex justify-center my-10">
                      <LoadingSpinner />
                    </div>
                  )}
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
