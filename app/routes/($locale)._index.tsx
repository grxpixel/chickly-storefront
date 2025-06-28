import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import HeroSlider from '~/components/HeroSlider';
import CategorySlider from '~/components/CategorySlider';
import CustomerReviewSlider from '~/components/CustomerReviewSlider';
import CategoryGrid from '~/components/CategoryGrid';
import CTABanner from '~/components/CTABanner';
// for product card motion
import {motion} from 'framer-motion';

import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
  });
}

// assign collection for featured product
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const country = context.storefront.i18n.country;
  const language = context.storefront.i18n.language;

  const [collectionOne, collectionTwo, collectionThree] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: 'tops-tunics', country, language},
    }),
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: 'new-in', country, language},
    }),
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: 'women-dresses', country, language},
    }),
  ]);
  // return collection
  return {
    featuredCollectionOne: collectionOne.collection,
    featuredCollectionTwo: collectionTwo.collection,
    featuredCollectionThree: collectionThree.collection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <HeroSlider />
      <CategorySlider />
      <FeaturedCollection
        collection={data.featuredCollectionOne}
        title="Featured Product"
      />

      <FeaturedCollection
        collection={data.featuredCollectionTwo}
        title="New In"
      />
      <CTABanner/>
      <CategoryGrid />
      <FeaturedCollection
        collection={data.featuredCollectionThree}
        title="New In"
      />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
      <CustomerReviewSlider />
      
    </div>
  );
}
// featured product creation
function FeaturedCollection({
  collection,
  title,
}: {
  collection: any;
  title: string;
}) {
  if (!collection) return null;

  const collectionHandle = collection.handle;

  return (
    <div className="flex justify-center flex-wrap flex-col items-center featured-collection w-full py-6 sm:py-10 sm:px-4 px-4">
      <h2 className="sm:text-3xl text-2xl  text-center mb-6 sm:mb-12">{title}</h2>

      <div className="w-full container max-w-6xl grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {collection.products.nodes.map((product: any) => {
          const images = product.images?.nodes || [];

          return (
            <motion.div
              key={product.id}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.4, ease: 'easeOut'}}
              viewport={{once: true, amount: 0.2}}
            >
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="block group overflow-hidden transition"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src={images[0]?.url}
                    alt={images[0]?.altText || product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {images[1] && (
                    <img
                      src={images[1]?.url}
                      alt={images[1]?.altText || product.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    
                  )}
                  <div className="absolute inset-0 transition-colors ">
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="backdrop-blur-sm rounded py-3 px-4 text-center bg-white/100 hover:bg-white/90 transition-colors">
                      <span className=" text-sm font-medium text-black tracking-wide">
                        Quick View
                      </span>
                    </div>
                  </div>
                </div>
                </div>
                {/* overlay on hover  */}
                

                <div className="py-4 text-center">
 <h3 className="text-sm sm:text-lg font-medium text-left truncate mb-1">
  {product.title}
</h3>


  <div className="mt-1 flex justify-start items-center gap-2">
    {product.variants?.nodes[0]?.compareAtPrice?.amount &&
      product.variants?.nodes[0]?.compareAtPrice?.amount !==
        product.priceRange.minVariantPrice.amount && (
        <>
          <span className="sm:text-sm text-xs text-gray-500 line-through">
  ₹{Math.round(product.variants.nodes[0].compareAtPrice.amount)}
</span>


          <span className="sm:text-base text-sm font-bold text-black">
  ₹{Math.round(product.priceRange.minVariantPrice.amount)}
</span>


          {/* ✅ Discount Badge */}
          <span className="bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-1 sm:px-2 py-1 rounded">
            {Math.round(
              (1 -
                parseFloat(product.priceRange.minVariantPrice.amount) /
                  parseFloat(product.variants.nodes[0].compareAtPrice.amount)) *
                100
            )}
            % OFF
          </span>
        </>
      )}

    {/* If no discount, show only price */}
    {!product.variants?.nodes[0]?.compareAtPrice?.amount ||
      product.variants?.nodes[0]?.compareAtPrice?.amount ===
        product.priceRange.minVariantPrice.amount ? (
      <span className="text-base font-bold text-black">
        <Money data={product.priceRange.minVariantPrice} />
      </span>
    ) : null}
  </div>
</div>

              </Link>
            </motion.div>
          );
        })}
      </div>

      <Link
        to={`/collections/${collectionHandle}`}
        className="inline-block bg-red-600 text-white px-8 py-1 rounded-2xl hover:bg-red-500 transition uppercase"
      >
        View All
      </Link>
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="flex justify-center flex-wrap flex-col items-center featured-collection px-4">
      <h2 className="text-3xl text-center mb-12">Product For You</h2>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            const productList = response?.products.nodes || [];

            return (
              <div className="w-full container max-w-7xl grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {productList.map((product) => {
                  const images = product.images?.nodes || [];

                  return (
                    <motion.div
                      key={product.id}
                      initial={{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      transition={{duration: 0.4, ease: 'easeOut'}}
                      viewport={{once: true, amount: 0.2}}
                    >
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        className="block group overflow-hidden transition"
                      >
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
                          <img
                            src={images[0]?.url}
                            alt={images[0]?.altText || product.title}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                          />
                          {images[1] && (
                            <img
                              src={images[1]?.url}
                              alt={images[1]?.altText || product.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                          )}
                        </div>

                        <div className="py-4 text-center">
                          <h4 className="text-sm font-medium text-left truncate mb-1">
                            {product.title}
                          </h4>
                          <div className="mt-1 flex justify-start items-center gap-2">
                            <span className="text-base font-bold text-black">
                              <Money
                                data={product.priceRange.minVariantPrice}
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 8) {
        nodes {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
          images(first: 2) {
            nodes {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        compareAtPrice {
          amount
          currencyCode
        }
      }
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
  }

  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;




