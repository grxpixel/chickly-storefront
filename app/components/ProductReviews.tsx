import { Star, StarHalf, StarOff } from 'lucide-react';

type Review = {
  id: number;
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  size: string;
  color: string;
  verified: boolean;
  image?: string;
};

type ReviewsData = {
  averageRating: number;
  totalReviews: number;
  ratingsDistribution: { [key: number]: number };
  reviewsWithImages: string[];
  topReviews: Review[];
};

export default function ProductReviews({ data }: { data: ReviewsData }) {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold">Customer reviews</h2>
          <div className="flex items-center gap-2">
            <Stars rating={data.averageRating} />
            <span className="text-lg font-medium">{data.averageRating} out of 5</span>
          </div>
          <p className="text-sm text-gray-500">{data.totalReviews} global ratings</p>

          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span>{star} star</span>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div className="bg-orange-400 h-2 rounded" style={{ width: `${data.ratingsDistribution[star] || 0}%` }}></div>
                </div>
                <span>{data.ratingsDistribution[star] || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-lg">Customers say</h3>
          <p className="text-sm text-gray-600">
            Customers give positive feedback about the shirt's style. However, fabric quality and fit receive mixed reviews.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Style', 'Quality', 'Fit', 'Fabric quality', 'Value for money'].map((tag) => (
              <span key={tag} className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Reviews with images</h3>
        <div className="flex gap-3 overflow-x-auto">
          {data.reviewsWithImages.map((img, idx) => (
            <div key={idx} className="w-28 h-28 rounded overflow-hidden border">
              <img src={img} alt="review-img" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Top reviews</h3>
        <div className="space-y-6">
          {data.topReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-lg font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{review.name}</div>
                  <div className="flex items-center gap-1">
                    <Stars rating={review.rating} />
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold">{review.title}</h4>
              <p className="text-sm text-gray-700">{review.text}</p>

              <div className="text-sm text-gray-500 mt-2">
                Size: {review.size}, Colour: {review.color}
                {review.verified && (
                  <span className="ml-2 text-orange-600 font-semibold">Verified Purchase</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
          Write a Product Review
        </button>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex text-orange-400">
      {[...Array(full)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
      {half && <StarHalf size={16} fill="currentColor" />}
      {[...Array(empty)].map((_, i) => <StarOff key={i} size={16} />)}
    </div>
  );
}
