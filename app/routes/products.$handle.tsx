import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';

import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import ProductImage from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import Breadcrumb from '~/components/Breadcrumb';
import ProductDescription from '~/components/ProductDescription';
import RelatedProducts from '~/components/RelatedProducts';
import ProductReviews from '~/components/ProductReviews';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const productId = product.id;

  const { productRecommendations } = await storefront.query(PRODUCT_RECOMMENDATIONS_QUERY, {
    variables: { productId },
  });

  return {
    product,
    productRecommendations,
  };
}


/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
 const { product, productRecommendations } = useLoaderData<typeof loader>();


  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // breadcrum Generating
  const breadcrumbItems = [{label: 'Home', url: '/'}, {label: product.title}];
const reviewsData = {
  averageRating: 4.5,
  totalReviews: 156,
  ratingsDistribution: {
    5: 70,
    4: 56,
    3: 15,
    2: 9,
    1: 6,
  },
  reviewsWithImages: [
    '/app/assets/CustomerReviewImage/1.jpg',
    '/app/assets/CustomerReviewImage/2.jpg',
    '/app/assets/CustomerReviewImage/3.jpg',
    '/app/assets/CustomerReviewImage/4.jpg',
  ],
  topReviews: [
    {
      id: 1,
      name: 'A Chang',
      rating: 5,
      title: 'Good stitching',
      text: 'Size: XL, Colour: White',
      date: '9 May 2025',
      size: 'XL',
      color: 'White',
      verified: true,
    },
    {
      id: 2,
      name: 'R Sharma',
      rating: 4,
      title: 'Good Fit',
      text: 'Looks good and fits well.',
      date: '10 May 2025',
      size: 'L',
      color: 'Pink',
      verified: true,
    },
  ],
};

  return (
    <div className="pt-1 md:pt-1">
      <div className="breadCrum max-w-7xl mx-auto px-4 md:px-8 product">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 ">
        {/* 2 column grid */}
        <div className="max-w-7xl product grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE (Sticky Images) */}
          <div className="md:sticky md:top-5 md:self-start">
            <ProductImage
              images={product.images.nodes.map((node) => ({
                id: node.id,
                url: node.url,
                altText: node.altText,
                width: node.width,
                height: node.height,
              }))}
              selectedVariantImage={selectedVariant.image}
            />
          </div>

          {/* RIGHT SIDE (Product Details) */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-2xl lg:text-2xl pb-1 font-amiri">
              {product.title}
            </h1>

            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant.compareAtPrice}
              className="text-xl text-black font-poppins font-bold not-italic text-[18px]"
            />

            {/* Your offers, form, description, etc */}
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <h2 className="font-semibold text-lg text-black mb-3">
                Offers{' '}
                <span className="font-normal text-gray-400 text-sm">
                  • 1 Available
                </span>
              </h2>

              <div className="bg-[#f9ffff] border border-dashed border-[#21b9b4] rounded-lg p-4 flex items-start gap-3">
                {/* Icon */}
                <div className="text-[#21b9b4]">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.59 13.41L10.59 3.41C10.21 3.03 9.7 2.79 9.17 2.79H5C3.9 2.79 3 3.69 3 4.79v4.17c0 .53.21 1.04.59 1.41l10 10c.39.39 1.02.39 1.41 0l5.59-5.59c.39-.39.39-1.02 0-1.41zM7 6c.55 0 1 .45 1 1S7.55 8 7 8 6 7.55 6 7s.45-1 1-1z" />
                  </svg>
                </div>

                {/* Offer Text */}
                <div>
                  <div className="font-semibold text-sm text-black">
                    Prepay & Save!
                  </div>
                  <div className="text-sm text-black">
                    20% OFF on all prepaid orders.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <ProductDescription
              descriptionHtml={product.descriptionHtml}
              ingredientsHtml={`
            Disclaimer: Color of the actual product may vary from the image.<br>
            Manufactured / Packed by : CHICLY FASHION<br>
            Manufactured in India
        `}
              customHtml={`<p>Free shipping available. Cash on delivery accepted.</p>`}
            />
          </div>
        </div>
        <ProductReviews data={reviewsData} />

         <RelatedProducts products={productRecommendations} />

      </div>

     


      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
      
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
  metafield(namespace: "custom", key: "additional_information") {
    value
  }
  
      
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $productId: ID!
  ) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      images(first: 2) {
        nodes {
          url
          altText
        }
      }
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
    }
  }
` as const;
