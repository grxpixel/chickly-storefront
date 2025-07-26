// app/components/CategoryGrid.tsx

import { Link } from '@remix-run/react';

const categories = [
  { name: 'KURTA', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img1.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'KURTA SETS', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img2.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'TOPS', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img3.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'DRESS', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img4.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'BOTTOM WEAR', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img5.webp?v=1753566495', link: '/collections/new-in' },
  { name: 'CO-ORDS', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img6.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'SAREE', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img7.webp?v=1753566496', link: '/collections/new-in' },
  { name: 'PRINTED KURTA', imageUrl: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/8.webp?v=1753566495', link: '/collections/new-in' },
];

export default function CategoryGrid() {
  return (
    <section className="w-full py-6 sm:py-10 sm:px-4 px-4">
      <h2 className="sm:text-3xl text-2xl  text-center mb-6 sm:mb-12">Shop Our Collection</h2>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-wrap md:justify-center md:gap-[12px]">
        {categories.map((cat, index) => (
          <Link
            to={cat.link}
            key={cat.name}
            prefetch="intent"
            className="w-[calc(20%-10px)] flex flex-col items-center text-center"
          >
            <div className="overflow-hidden shadoww-full aspect-square p-2">
              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain" />
            </div>
            <span className="mt-3 text-center collection-text font-medium uppercase">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Mobile Layout (optional) */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            to={cat.link}
            key={cat.name}
            prefetch="intent"
            className="flex flex-col items-center text-center"
          >
            <div className="w-[170px] h-[170px] rounded-full overflow-hidden ">
              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain" />
            </div>
            <span className="mt-2 text-sm">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
