import {useSearchParams} from '@remix-run/react';
import {useState} from 'react';

export default function Sort() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

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
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || 'Featured';

  const handleSelect = (value: string) => {
    if (value === selectedValue) {
      setIsOpen(false);
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('sort', value);
    } else {
      newParams.delete('sort');
    }

    // Clear pagination cursors if present
    newParams.delete('after');
    newParams.delete('before');

    setSearchParams(newParams);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 bg-white"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-sm text-gray-700 flex items-center gap-1">
          <span className="text-gray-400">⇅</span> Sort by
        </span>
        <span className="font-medium text-sm">{selectedLabel}</span>

        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg focusable="false" width="12" height="8" className="icon icon--chevron icon--inline" viewBox="0 0 12 8">
            <path fill="none" d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 bg-white border rounded shadow">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${
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
      )}
    </div>
  );
}
