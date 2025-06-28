import { useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

export default function MobileSortOptions({ onClose }: { onClose: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);

  const options = [
    { value: '', label: 'Featured' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'title-asc', label: 'Alphabetically, A-Z' },
    { value: 'title-desc', label: 'Alphabetically, Z-A' },
    { value: 'price-asc', label: 'Price, low to high' },
    { value: 'price-desc', label: 'Price, high to low' },
    { value: 'created-asc', label: 'Date, old to new' },
    { value: 'created-desc', label: 'Date, new to old' },
  ];

  const selectedValue = searchParams.get('sort') || '';

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('sort', value);
    else newParams.delete('sort');
    newParams.delete('after');
    newParams.delete('before');
    setSearchParams(newParams);
    closeWithAnimation();
  };

  const closeWithAnimation = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // match transition duration
  };

  useEffect(() => {
    setShow(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/5 backdrop-blur-[1.5px] md:hidden">
      <div
        className={`w-full bg-white rounded-t-xl max-h-[80vh] overflow-y-auto shadow-lg transform transition-all duration-300 ease-in-out
          ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-black/10">
          <h2 className="text-xl font-bold font-amiri flex items-center gap-2">Sort By</h2>
          <button onClick={closeWithAnimation} className="text-xl font-bold">✖</button>
        </div>

        <div className="p-2">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`cursor-pointer px-4 py-3 text-sm hover:bg-gray-100 flex justify-between items-center ${
                selectedValue === option.value ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              {option.label}
              {selectedValue === option.value && (
                <svg className="h-4 w-4 text-black ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
