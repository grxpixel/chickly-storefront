import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import ProductCard from '~/components/CollectionPage/Product/ProductCard';
import Filters from '~/components/CollectionPage/Filters/Filters';
import Sort from '~/components/CollectionPage/Sort/Sort';
import type {ProductItemFragment} from 'storefrontapi.generated';

// META
export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Collection | ${data?.collection.title ?? ''}`}];
};

// MAIN LOADER
export async function loader(args: LoaderFunctionArgs) {
  const {handle} = args.params;
  const {storefront} = args.context;

  if (!handle) {
    throw redirect('/collections');
  }

  const paginationVariables = getPaginationVariables(args.request, {pageBy: 8});
  const url = new URL(args.request.url);
  const searchParams = url.searchParams;

  // Parse filters from URL
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const sizes = searchParams.getAll('size');
  const fabrics = searchParams.getAll('fabric');
  const sortParam = searchParams.get('sort');

  // Build Filters Array
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
      filters.push({
        variantOption: {
          name: 'Size',
          value: size,
        },
      });
    });
  }

  if (fabrics.length > 0) {
    fabrics.forEach((fabric) => {
      filters.push({
        productMetafield: {
          namespace: 'custom',
          key: 'fabric',
          value: fabric,
        },
      });
    });
  }

  // Sort Mapping — Map frontend sort param to Shopify sort keys
  const sortMapping: Record<string, string> = {
    '': 'RELEVANCE',
    'best-selling': 'BEST_SELLING',
    'title-asc': 'TITLE',
    'title-desc': 'TITLE_DESC',
    'price-asc': 'PRICE',
    'price-desc': 'PRICE_DESC',
    'created-asc': 'CREATED',
    'created-desc': 'CREATED_DESC',
  };

  const sortKey = sortMapping[sortParam ?? ''] ?? 'RELEVANCE';

  try {
    const variables: Record<string, any> = {
      handle,
      sortKey,
      ...paginationVariables,
    };

    if (filters.length > 0) {
      variables.filters = filters;
    }

    const [{collection}] = await Promise.all([
      storefront.query(COLLECTION_QUERY, {
        variables,
      }),
    ]);

    if (!collection) {
      console.error(`Collection ${handle} not found`);
      throw new Response(`Collection ${handle} not found`, {status: 404});
    }

    return defer({collection});
  } catch (error: any) {
    console.error('GraphQL Query Error:', JSON.stringify(error, null, 2));
    throw new Response('Something went wrong', {status: 500});
  }
}

// FRONTEND COMPONENT
export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-full mx-auto px-14 py-10">
      {/* <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
      <p className="mb-10 text-gray-600">{collection.description}</p> */}

      <div className="flex gap-8">
        <div className="w-1/4">
          <Filters />
        </div>

        <div className="w-3/4">
          <div className="flex justify-end mb-6">
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

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

// GRAPHQL FRAGMENT
const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 5) {
      nodes {
        id
        url
        altText
      }
    }
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// MAIN COLLECTION QUERY
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
        sortKey: $sortKey
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
