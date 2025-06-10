import { useRef } from 'react';

const reviews = [
  {
    name: 'Khushi Bhatia',
    image: '/app/assets/CustomerReviewImage/tes1.webp',
    rating: 5,
    comment: 'I really like this. It looks classy. I prefer dresses with minimal embroidery, so this is perfect for me.',
  },
  {
    name: 'Nikki Kala',
    image: '/app/assets/CustomerReviewImage/tes2.webp',
    rating: 5,
    comment: 'Material quality was too good. Awesome colour..',
  },
  {
    name: 'Pratima Kukreja',
    image: '/app/assets/CustomerReviewImage/tes3.webp',
    rating: 5,
    comment: 'Amazing suit; the color is so beautiful, and the fit is perfect.',
  },
  {
    name: 'Natasha Goswami',
    image: '/app/assets/CustomerReviewImage/tes4.webp',
    rating: 5,
    comment: 'The dress is perfect. Go for it. The material is light weight and soft and you don’t feel like you’re wearing this and the look is great.',
  },
  {
    name: 'Mitali Sethi',
    image: '/app/assets/CustomerReviewImage/tes5.webp',
    rating: 5,
    comment: 'Nice dress with bright colour and good quality... happy to purchase it 🍑',
  },
    {
    name: 'Mitali Sethi',
    image: '/app/assets/CustomerReviewImage/tes6.webp',
    rating: 5,
    comment: 'Nice dress with bright colour and good quality... happy to purchase it 🍑',
  },
];

export default function CustomerReviewSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-10 px-4">
      <h2 className="text-3xl text-center mb-12">Customer Reviews</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute collection-arrow cursor-pointer left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/80 transition-colors rounded-full shadow-md"
        >
          <span className="text-2xl text-gray-700">&#10094;</span>
        </button>

        {/* Scrollable Container */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-8 "
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="w-[200px] sm:min-w-[200px] lg:w-[280px] flex-shrink-0 mb-1.5"
              
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-full h-[350px] object-cover !rounded-2xl"
              />
              <div className="review-content" style={{
      boxShadow: '0px 1px 4px -1px #ed6078',
      background: 'rgba(243, 207, 214, 0.19)',
      padding: '15px 5px',
      borderRadius: '0px 0px 12px 12px',
    }} >
                <div className="flex justify-center mb-2">
                {'★'.repeat(review.rating).padEnd(5, '☆').split('').map((star, i) => (
                  <span key={i} className="text-yellow-400 text-xl">{star}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 text-center mb-2">{review.comment}</p>
              <p className="text-center font-bold">{review.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-2 collection-arrow cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/80 transition-colors rounded-full shadow-md"
        >
          <span className="text-2xl text-gray-700">&#10095;</span>
        </button>
      </div>

      {/* <div className="text-center mt-8">
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
          VIEW ALL
        </button>
      </div> */}
    </div>
  );
}
