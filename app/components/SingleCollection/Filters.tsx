import {useSearchParams} from '@remix-run/react';
import {useState} from 'react';

const filterOptions = {
  Price: [
    {label: 'Under ₹499', min: 0, max: 499},
    {label: '₹500 - ₹999', min: 500, max: 999},
    {label: '₹1000 - ₹1999', min: 1000, max: 1999},
    {label: '₹2000+', min: 2000, max: null},
  ],
  Size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Discount: ['10% or more', '20% or more', '30% or more', '50% or more'],
  Fabric: ['Cotton', 'Georgette', 'Rayon', 'Linen', 'Chiffon', 'Crepe'],
};

export default function Filters() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleMultiValue = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const values = newParams.getAll(key);

    if (values.includes(value)) {
      newParams.delete(key);
      values.filter((v) => v !== value).forEach((v) => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const applyPrice = (min: number, max: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('priceMin', String(min));
    if (max !== null) newParams.set('priceMax', String(max));
    else newParams.delete('priceMax');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const Chevron = ({isOpen}: {isOpen: boolean}) => (
    <span
      className="transition-transform duration-300"
      style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}
    >
      <svg
        focusable="false"
        width="12"
        height="8"
        className="icon icon--chevron icon--inline"
        viewBox="0 0 12 8"
      >
        <path
          fill="none"
          d="M1 1l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.1"
        ></path>
      </svg>
    </span>
  );

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-2 font-amiri flex items-center gap-2">
        <img src="/app/assets/Icons/Vector_11.png" alt="" /> Filters
      </h3>

      {/* Price Accordion */}
      <div className="border-b border-black/10 pt-4 pb-4">
        <button
          onClick={() => setOpenFilter(openFilter === 'Price' ? null : 'Price')}
          className="flex justify-between items-center w-full text-left font-semibold text-lg"
        >
          Price
          <Chevron isOpen={openFilter === 'Price'} />
        </button>
        {openFilter === 'Price' && (
          <div className="mt-3 pl-1 space-y-2">
            {filterOptions.Price.map(({label, min, max}) => (
              <label key={label} className="block text-sm text-gray-700">
                <input
                  type="radio"
                  name="price"
                  onChange={() => applyPrice(min, max)}
                  checked={
                    searchParams.get('priceMin') === String(min) &&
                    (max === null || searchParams.get('priceMax') === String(max))
                  }
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Accordion */}
      <div className="border-b border-black/10 pt-4 pb-4">
        <button
          onClick={() => setOpenFilter(openFilter === 'Size' ? null : 'Size')}
          className="flex justify-between items-center w-full text-left font-semibold text-lg"
        >
          Size
          <Chevron isOpen={openFilter === 'Size'} />
        </button>
        {openFilter === 'Size' && (
          <div className="mt-3 pl-1 space-y-2">
            {filterOptions.Size.map((size) => (
              <label key={size} className="block text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={searchParams.getAll('size').includes(size)}
                  onChange={() => toggleMultiValue('size', size)}
                />
                {size}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fabric Accordion */}
      <div className="border-b border-black/10 pt-4 pb-4">
        <button
          onClick={() => setOpenFilter(openFilter === 'Fabric' ? null : 'Fabric')}
          className="flex justify-between items-center w-full text-left font-semibold text-lg"
        >
          Fabric
          <Chevron isOpen={openFilter === 'Fabric'} />
        </button>
        {openFilter === 'Fabric' && (
          <div className="mt-3 pl-1 space-y-2">
            {filterOptions.Fabric.map((fabric) => (
              <label key={fabric} className="block text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={searchParams.getAll('fabric').includes(fabric)}
                  onChange={() => toggleMultiValue('fabric', fabric)}
                />
                {fabric}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount Accordion */}
      <div className="border-b border-black/10 pt-4 pb-4">
        <button
          onClick={() => setOpenFilter(openFilter === 'Discount' ? null : 'Discount')}
          className="flex justify-between items-center w-full text-left font-semibold text-lg"
        >
          Discount
          <Chevron isOpen={openFilter === 'Discount'} />
        </button>
        {openFilter === 'Discount' && (
          <div className="mt-3 pl-1 space-y-2">
            {filterOptions.Discount.map((discount) => (
              <label key={discount} className="block text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={searchParams.getAll('discount').includes(discount)}
                  onChange={() => toggleMultiValue('discount', discount)}
                />
                {discount}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
