import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {motion} from 'framer-motion';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Products() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection px-4 py-10">
      <h1 className="text-3xl text-center mb-10 text-red-500">Products</h1>
      <PaginatedResourceSection
        connection={products}
        resourcesClassName="w-full container max-w-7xl grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {({node: product, index}) => (
          <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const images = product.images?.nodes || [];

  return (
    <motion.div
      key={product.id}
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: 'easeOut'}}
      viewport={{once: true, amount: 0.2}}
    >
      <Link className="block group overflow-hidden transition" prefetch="intent" to={variantUrl}>
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
          <img
            src={images[0]?.url}
            alt={images[0]?.altText || product.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            loading={loading}
          />
          {images[1] && (
            <img
              src={images[1]?.url}
              alt={images[1]?.altText || product.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              loading={loading}
            />
          )}

          {/* Quick View Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="backdrop-blur-sm rounded py-3 px-4 text-center bg-white/100 hover:bg-white/90 transition-colors">
              <span className="text-sm font-medium text-black tracking-wide">Quick View</span>
            </div>
          </div>
        </div>

        <div className="py-4 text-center">
          <h3 className="text-lg font-medium text-left truncate mb-1">{product.title}</h3>

          <div className="mt-1 flex justify-start items-center gap-2">
            {product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount ? (
              <>
                <span className="text-sm text-gray-500 line-through">
                  <Money data={product.priceRange.maxVariantPrice} />
                </span>
                <span className="text-base font-bold text-black">
                  <Money data={product.priceRange.minVariantPrice} />
                </span>
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {Math.round(
                    (1 -
                      parseFloat(product.priceRange.minVariantPrice.amount) /
                        parseFloat(product.priceRange.maxVariantPrice.amount)) *
                      100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-black">
                <Money data={product.priceRange.minVariantPrice} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
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
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
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

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
