import {useRef} from 'react';
import {Link} from 'react-router-dom'; // <-- Make sure this import exists

const categories = [
  {
    label: 'GOWNS',
    image: '/app/assets/CategoryImage/img1.webp',
    link: '/collections/new-in',
  },
  {
    label: 'CO-ORDS SET',
    image: '/app/assets/CategoryImage/img2.webp',
    link: '/collections/tops-tunics',
  },
  {
    label: 'SHARARA',
    image: '/app/assets/CategoryImage/img3.webp',
    link: '/collections/women-dresses',
  },
  {
    label: 'JUMPSUIT',
    image: '/app/assets/CategoryImage/img6.webp',
    link: '/collections/kurta-suit-sets',
  },
  {
    label: 'KURTA SETS',
    image: '/app/assets/CategoryImage/img5.webp',
    link: '/collections/women-dresses',
  },
  {
    label: 'KURTA SETS',
    image: '/app/assets/CategoryImage/img4.webp',
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
    <div className="w-full py-10 px-4">
      <h2 className="text-3xl text-center mb-12">Categories</h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-2 collection-arrow cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/80 transition-colors rounded-full shadow-md"
        >
          <span className="text-2xl text-gray-700">&#10094;</span>
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-8"
        >
          {categories.map((cat, index) => (
            <Link
              to={cat.link}
              key={index}
              className="min-w-[200px] sm:min-w-[250px] lg:min-w-[280px] flex-shrink-0"
            >
              <div className="rounded-2xl overflow-hidden h-[400px] relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-[400px] object-cover"
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
