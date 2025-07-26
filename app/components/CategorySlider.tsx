import {useRef} from 'react';
import {Link} from 'react-router-dom'; // <-- Make sure this import exists

const categories = [
  {
    label: 'GOWNS',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img3_2f049ed6-e52b-4932-aafe-eb3eacf67267.webp?v=1753567160',
    link: '/collections/new-in',
  },
  {
    label: 'CO-ORDS SET',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img2_69034c0e-3537-499a-9c59-d35b33631b14.webp?v=1753567160',
    link: '/collections/tops-tunics',
  },
  {
    label: 'SHARARA',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img4_da35e79a-7233-447a-b96e-67ca5c22c2a9.webp?v=1753567160',
    link: '/collections/women-dresses',
  },
  {
    label: 'JUMPSUIT',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img5_605f514e-c7a9-418b-a944-6d0633e191cd.webp?v=1753567160',
    link: '/collections/kurta-suit-sets',
  },
  {
    label: 'KURTA SETS',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img1_087eb51a-bf67-49da-8bf2-74307b40ee0e.webp?v=1753567158',
    link: '/collections/women-dresses',
  },
  {
    label: 'KURTA SETS',
    image: 'https://cdn.shopify.com/s/files/1/0661/0495/1028/files/img6_c9468091-1c6f-4956-9d8c-9a4304c69c8e.webp?v=1753567159',
    link: '/collections/tops-tunics',
  }
];

export default function CategorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({left: -300, behavior: 'smooth'});
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({left: 300, behavior: 'smooth'});
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 sm:px-4 px-4">
      <h2 className="sm:text-3xl text-2xl  text-center mb-6 sm:mb-12">Categories</h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-2 collection-arrow cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/80 transition-colors rounded-full shadow-md"
        >
          <span className="text-2xl text-gray-700">&#10094;</span>
        </button>

        <div
  ref={sliderRef}
  className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-8 snap-x snap-mandatory"
>

          {categories.map((cat, index) => (
            <Link
  to={cat.link}
  key={index}
  className="min-w-[200px] w-[200px] sm:min-w-[250px] lg:min-w-[280px] flex-shrink-0 snap-start"
>
              <div className="rounded-2xl overflow-hidden h-[300px] sm:h-[400px]  relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                />
                <p className="mt-3 text-center collection-text font-medium uppercase absolute">
                  {cat.label}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute collection-arrow cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/80 transition-colors rounded-full shadow-md"
        >
          <span className="text-2xl text-gray-700">&#10095;</span>
        </button>
      </div>
    </div>
  );
}
