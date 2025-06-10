// app/components/FullBanner.tsx

import { Link } from '@remix-run/react';

export default function FullBanner() {
  return (
    <section className="w-full">
      <Link to="/collections/new-in" prefetch="intent">
        <img
          src="/app/assets/CTABAnner/1.jpg" // 👈 Replace with your banner path
          alt="Shop the latest styles"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </Link>
    </section>
  );
}
