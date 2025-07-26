import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import ProductCard from '~/components/CollectionPage/Product/ProductCard';
import Filters from '~/components/SingleCollection/Filters';
import Sort from '~/components/CollectionPage/Sort/Sort';
import type {ProductItemFragment} from 'storefrontapi.generated';
import MobileSortOptions from '~/components/CollectionPage/Sort/MobileSortOptions';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Collection | ${data?.collection.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const {handle} = args.params;
  const {storefront} = args.context;

  if (!handle) {
    throw redirect('/collections');
  }

  const paginationVariables = getPaginationVariables(args.request, {pageBy: 8});
  const url = new URL(args.request.url);
  const searchParams = url.searchParams;

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const sizes = searchParams.getAll('size');
  const fabrics = searchParams.getAll('fabric');
  const sortParam = searchParams.get('sort');

  const filters: any[] = [];

  if (priceMin || priceMax) {
    filters.push({
      price: {
        ...(priceMin ? {min: parseFloat(priceMin)} : {}),
        ...(priceMax ? {max: parseFloat(priceMax)} : {}),
      },
    });
  }

  if (sizes.length > 0) {
    sizes.forEach((size) => {
      filters.push({variantOption: {name: 'Size', value: size}});
    });
  }

  if (fabrics.length > 0) {
    fabrics.forEach((fabric) => {
      filters.push({
        productMetafield: {namespace: 'custom', key: 'fabric', value: fabric},
      });
    });
  }

  const sortMapping: Record<string, {sortKey: string; reverse?: boolean}> = {
    '': {sortKey: 'RELEVANCE'},
    'best-selling': {sortKey: 'BEST_SELLING'},
    'title-asc': {sortKey: 'TITLE'},
    'title-desc': {sortKey: 'TITLE', reverse: true},
    'price-asc': {sortKey: 'PRICE'},
    'price-desc': {sortKey: 'PRICE', reverse: true},
    'created-asc': {sortKey: 'CREATED'},
    'created-desc': {sortKey: 'CREATED', reverse: true},
  };

  const sortInput = sortMapping[sortParam ?? ''] ?? {sortKey: 'RELEVANCE'};

  try {
    const variables: Record<string, any> = {
      handle,
      sortKey: sortInput.sortKey,
      reverse: sortInput.reverse ?? false,
      ...paginationVariables,
    };

    if (filters.length > 0) variables.filters = filters;

    const [{collection}] = await Promise.all([
      storefront.query(COLLECTION_QUERY, {variables}),
    ]);

    if (!collection)
      throw new Response(`Collection ${handle} not found`, {status: 404});

    return defer({collection});
  } catch (error: any) {
    console.error('GraphQL Query Error:', JSON.stringify(error, null, 2));
    throw new Response('Something went wrong', {status: 500});
  }
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="max-w-full mx-auto sm:px-6">
      {/* Mobile Top Buttons */}
      <div className="sticky bg-white top-0 z-30 flex justify-between mb-4 md:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="border-b border-black/20 p-3 w-1/2 flex justify-center items-center gap-2"
        >
          <img src="/app/assets/Icons/Vector_11.png" alt="" />
          Filters
        </button>
        <button
          onClick={() => setIsSortOpen(true)}
          className="border-b border-black/20 border-l p-3 w-1/2"
        >
          <span className="text-gray-600">⇅</span> Sort
        </button>
      </div>

      {/* Left Slide Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[80%] max-w-sm bg-white h-full transform translate-x-0 transition-transform duration-300 ease-out shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-black/10">
              <h2 className="text-2xl font-bold font-amiri flex items-center gap-2">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>✖</button>
            </div>
            <div className="p-4 overflow-y-auto">
              <Filters />
            </div>
          </div>
          <div
            className="flex-1 bg-black/5 backdrop-blur-[2px]"
            onClick={() => setIsFilterOpen(false)}
          />
        </div>
      )}

      {/* Bottom Sheet Sort */}
      {isSortOpen && <MobileSortOptions onClose={() => setIsSortOpen(false)} />}

      {/* Product Section - hide when drawer open */}
      <div className="collection-banner">
        <img src="/app/assets/CTABAnner/new_arrival_banner_chicly_copy.jpg" alt="" />
      </div>
      <div className="flex flex-col md:flex-row px-4 py-6 gap-6">
      
        
           {/* Desktop Filter */}
          <div className="hidden sticky top-10 md:block w-1/4 h-fit flex-col">
            <Filters />
          </div>

          <div className="md:w-3/4">
            <div className="hidden md:flex justify-end mb-6">
              <Sort />
            </div>

            <PaginatedResourceSection
              connection={collection.products}
              resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {({node: product}: {node: ProductItemFragment}) => (
                <ProductCard key={product.id} product={product} />
              )}
            </PaginatedResourceSection>
          </div>
         </div>
      +
      

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 { amount currencyCode }
  fragment ProductItem on Product {
    id handle title featuredImage { id altText url width height }
    images(first: 5) { nodes { id url altText } }
    variants(first: 1) { nodes { id compareAtPrice { amount currencyCode } } }
    priceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode,
    $first: Int,
    $last: Int,
    $startCursor: String,
    $endCursor: String,
    $filters: [ProductFilter!],
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean         # ✅ Added
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse      # ✅ Added
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
