import {Link} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useVariantUrl} from '~/lib/variants';

export default function ProductCard({product}: {product: any}) {
  const variantUrl = useVariantUrl(product.handle);
  const images = product.images.nodes;
  const variant = product.variants.nodes[0];
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAt = variant?.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : 0;
  const discount = compareAt > minPrice ? Math.round(((compareAt - minPrice) / compareAt) * 100) : 0;

  return (
    <motion.div initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} transition={{duration: 0.4, ease: 'easeOut'}} viewport={{once: true}}>
      <Link to={variantUrl} className="block group overflow-hidden">
        <div className="relative w-full rounded-2xl overflow-hidden aspect-[3/4]">
          <img src={images[0]?.url} alt={product.title} className="absolute w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" />
          {images[1] && <img src={images[1]?.url} alt={product.title} className="absolute w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
        </div>
        <div className="py-4 text-center">
          <h3 className="text-sm sm:text-lg font-medium text-left truncate mb-1">{product.title}</h3>
          <div className="flex items-center gap-2">
            <span className="sm:text-base text-sm font-bold text-black">
  ₹{Math.round(parseFloat(product.priceRange.minVariantPrice.amount)).toLocaleString('en-IN')}
</span>

{compareAt > minPrice && (
  <>
    <span className="sm:text-sm text-xs text-gray-500 line-through">
      ₹{Math.round(compareAt).toLocaleString('en-IN')}
    </span>

    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-1 sm:px-2 py-1 rounded">
      {discount}% OFF
    </span>
  </>
)}

          </div>
        </div>
      </Link>
    </motion.div>
  );
}
