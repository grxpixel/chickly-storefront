import {useLoaderData, useFetcher, Await} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState, useCallback} from 'react'; 
import { collectionsLoader } from '~/components/CollectionPage/Loaders/collectionsLoader'; 
import Filters from '~/components/CollectionPage/Filters/Filters';
import Sort from '~/components/CollectionPage/Sort/Sort';
import MobileSortOptions from '~/components/CollectionPage/Sort/MobileSortOptions';
import ProductCard from '~/components/CollectionPage/Product/ProductCard';
import LoadingSpinner from '~/components/CollectionPage/Product/LoadingSpinner';

export const loader = collectionsLoader;
export const meta = () => [{title: 'All Products'}];

export default function CollectionsAllPage() {
  const {products, discountFilters, searchParams} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const observer = useRef<IntersectionObserver>();
  const [extraItems, setExtraItems] = useState<any[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

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
    <div className="max-w-screen mx-auto sm:py-6">
      {/* Mobile Top Sticky Filter & Sort Buttons */}
      <div className="sticky bg-white top-0 z-30 flex justify-between mb-4 md:hidden">
        <button onClick={() => setIsFilterOpen(true)} className="border-b border-black/20 p-3 w-1/2 flex justify-center items-center gap-2"><img src="/app/assets/Icons/Vector_11.png" alt="" />Filters</button>
        <button onClick={() => setIsSortOpen(true)} className="border-b border-black/20 border-l p-3 w-1/2"><span className="text-gray-600">⇅</span>Sort</button>
      </div>

      {/* Mobile Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden backdrop-blur-[2px] bg-black/5">
          <div className="w-[80%] max-w-sm bg-white h-full transform translate-x-0 transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-xl font-bold">✖</button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <Filters />
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsFilterOpen(false)} />
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden items-end justify-center backdrop-blur-[2px] bg-black/5">
          <div className="w-full bg-white rounded-t-xl max-h-[80vh] transition-transform duration-300 ease-in-out translate-y-0">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button onClick={() => setIsSortOpen(false)} className="text-xl font-bold">✖</button>
            </div>
            <div className="p-4">
              <MobileSortOptions onClose={() => setIsSortOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - Always show products */}
      <div className="flex gap-8 px-4 py-6">
        {/* Desktop Filters */}
        <div className="hidden md:block w-72 sticky top-24 h-fit flex-col">
          <Filters />
        </div>

        <div className="flex-1">
          <div className="hidden md:flex justify-end mb-6">
            <Sort />
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <Await resolve={products}>
              {(data: any) => {
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
                    <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
}