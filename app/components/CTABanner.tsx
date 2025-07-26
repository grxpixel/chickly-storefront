// app/components/FullBanner.tsx

import { Link } from '@remix-run/react';

export default function FullBanner() {
  return (
    <section className="w-full">
      <Link to="/collections/new-in" prefetch="intent">
        <img
          src="https://cdn.shopify.com/s/files/1/0661/0495/1028/files/1_ca936183-6d23-4f63-9bc4-366297d0fd52.jpg?v=1753566353" // 👈 Replace with your banner path
          alt="Shop the latest styles"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </Link>
    </section>
  );
}
