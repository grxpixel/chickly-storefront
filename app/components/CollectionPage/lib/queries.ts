export const COLLECTION_QUERY = `#graphql
  query CollectionProducts(
    $first: Int
    $after: String
    $before: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(first: $first, after: $after, before: $before, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes {
        id handle title
        images(first: 2) { nodes { url altText width height } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { compareAtPrice { amount currencyCode } } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
` as const;
