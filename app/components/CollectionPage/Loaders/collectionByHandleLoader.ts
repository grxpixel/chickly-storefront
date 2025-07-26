import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';

export async function collectionByHandleLoader(args: LoaderFunctionArgs) {
  const url = new URL(args.request.url);
  const isFetcherRequest = url.searchParams.has('after'); // detect if it's pagination call

  const criticalData = await loadCriticalData(args);

  if (isFetcherRequest) {
    // pagination request: only return products data
    return {collection: {products: criticalData.collection.products}};
  } else {
    // full SSR page load
    return defer(criticalData);
  }
}

async function loadCriticalData({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {pageBy: 8});

  const url = new URL(request.url);
  const sortParam = url.searchParams.get("sort");

  let sortKey: any = "RELEVANCE";
  let reverse = false;

  if (sortParam === "price-desc") {
    sortKey = "PRICE";
    reverse = true;
  } else if (sortParam === "price-asc") {
    sortKey = "PRICE";
    reverse = false;
  } else if (sortParam === "best-selling") {
    sortKey = "BEST_SELLING";
  } else if (sortParam === "created-desc") {
    sortKey = "CREATED";
    reverse = true;
  }

  if (!handle) throw redirect('/collections');

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables, // includes first & after
        sortKey,
        reverse
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  return {collection};
}

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
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
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

// ✅ FIXED QUERY
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        after: $after,
        sortKey: $sortKey,
        reverse: $reverse
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
