import {
  useLoaderData,
  useFetcher,
  Link,
} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {useEffect, useState, useRef} from 'react';

const PAGE_SIZE = 10;

export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const after = url.searchParams.get('after') || undefined;

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {
      first: PAGE_SIZE,
      after,
    },
  });

  return defer({collections});
}

export default function Collections() {
  const initial = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  const [collections, setCollections] = useState<CollectionFragment[]>(
    initial.collections.nodes ?? []
  );
  const [cursor, setCursor] = useState<string | undefined>(
    initial.collections.pageInfo?.endCursor ?? undefined
  );
  const [hasNextPage, setHasNextPage] = useState(
    initial.collections.pageInfo?.hasNextPage ?? false
  );
  const [lastFetchedCursor, setLastFetchedCursor] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetched = fetcher.data?.collections;

    if (
      fetched &&
      fetched.nodes &&
      fetched.pageInfo?.endCursor !== lastFetchedCursor
    ) {
      setCollections((prev) => [...prev, ...fetched.nodes]);
      setCursor(fetched.pageInfo?.endCursor);
      setHasNextPage(fetched.pageInfo?.hasNextPage ?? false);
      setLastFetchedCursor(fetched.pageInfo?.endCursor ?? null);
    }
  }, [fetcher.data, lastFetchedCursor]);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && cursor) {
          fetcher.submit({after: cursor}, {method: 'get', action: '/collections'});
        }
      },
      {
        rootMargin: '200px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [cursor, hasNextPage, fetcher]);

  return (
    <div className="py-10 px-4 md:px-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Explore Our Collections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-10" ref={loadMoreRef}>
          <div className="flex justify-center items-center space-x-2">
            <span className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
            <span className="text-sm text-gray-600">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-300"
    >
      {collection.image ? (
        <Image
          alt={collection.image.altText ?? collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : 'lazy'}
          sizes="(min-width: 45em) 400px, 100vw"
          className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105 animate-fadeIn"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto mb-2"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="text-gray-500 text-sm italic">No image</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 w-full bg-black/50 text-white text-center py-3 transition-opacity duration-300 opacity-90 group-hover:opacity-100">
        <h5 className="text-sm md:text-base font-semibold">{collection.title}</h5>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }

  query StoreCollections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
    $after: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, after: $after) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;


