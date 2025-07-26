// /lib/queries/collectionByHandle.ts

export const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query CollectionByHandle(
    $handle: String!
    $query: String
    $first: Int
    $after: String
    $before: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        query: $query
        first: $first
        after: $after
        before: $before
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
          id
          handle
          title
          featuredImage {
            id
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          variants(first: 1) {
            nodes {
              compareAtPrice { amount currencyCode }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
` as const;
