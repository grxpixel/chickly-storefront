import { Link } from '@remix-run/react';
import { Money } from '@shopify/hydrogen';
import { motion } from 'framer-motion';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

// Types

type ProductImage = {
  url: string;
  altText?: string;
};

type Variant = {
  compareAtPrice?: MoneyV2;
};

type Product = {
  id: string;
  handle: string;
  title: string;
  images: { nodes: ProductImage[] };
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  variants: { nodes: Variant[] };
};

type Collection = {
  id: string;
  handle: string;
  title: string;
  products: { nodes: Product[] };
};

type RelatedProductsProps = {
  products: Product[];
}


// Component

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="flex justify-center flex-wrap flex-col items-center px-4 py-10">
      <h2 className="text-3xl text-center mb-12">Related Products</h2>

      <div className="w-full container max-w-6xl grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const images = product.images?.nodes || [];
          const compareAtPrice = product.variants.nodes[0]?.compareAtPrice?.amount;
          const currentPrice = product.priceRange.minVariantPrice.amount;

          const hasDiscount =
            compareAtPrice && compareAtPrice !== currentPrice;

          const discountPercentage = hasDiscount
            ? Math.round(
                (1 - parseFloat(currentPrice) / parseFloat(compareAtPrice!)) * 100
              )
            : 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link
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
                  <h3 className="text-lg font-medium text-left truncate mb-1">
                    {product.title}
                  </h3>

                  <div className="mt-1 flex justify-start items-center gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          <Money data={product.variants.nodes[0].compareAtPrice!} />
                        </span>

                        <span className="text-base font-bold text-black">
                          <Money data={product.priceRange.minVariantPrice} />
                        </span>

                        <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          {discountPercentage}% OFF
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
        })}
      </div>
    </div>
  );
}

