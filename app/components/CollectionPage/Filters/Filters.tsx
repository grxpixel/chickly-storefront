import {useSearchParams} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {useDebounce} from 'use-debounce';
import classNames from 'classnames'; // Optional for clean class toggling

// Accordion Component with animation
function Accordion({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: string | null;
  toggle: (title: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === title;

  return (
    <div className="border-b border-black/10 pb-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggle(title)}
      >
        <p className="font-semibold font-filson">{title}</p>
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
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2 space-y-1">{children}</div>
      </div>
    </div>
  );
}

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (section: string) =>
    setOpen(open === section ? null : section);

  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');

  const [debouncedMin] = useDebounce(priceMin, 400);
  const [debouncedMax] = useDebounce(priceMax, 400);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedMin) newParams.set('priceMin', debouncedMin);
    else newParams.delete('priceMin');
    newParams.delete('after');
    setSearchParams(newParams);
  }, [debouncedMin]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedMax) newParams.set('priceMax', debouncedMax);
    else newParams.delete('priceMax');
    newParams.delete('after');
    setSearchParams(newParams);
  }, [debouncedMax]);

  const handleCheckbox = (name: string, value: string) => {
    const current = searchParams.getAll(name);
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('after');
    newParams.delete(name);
    newValues.forEach((v) => newParams.append(name, v));
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold mb-2 font-amiri flex items-center gap-2">
        <img src="/app/assets/Icons/Vector_11.png" alt="" /> Filters
      </h3>

      <Accordion title="Price" open={open} toggle={toggle}>
        <div className="flex gap-2 ">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="border w-20 p-1 font-filson"
            placeholder="Min"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="border w-20 p-1 font-filson"
            placeholder="Max"
          />
        </div>
      </Accordion>

      <Accordion title="Size" open={open} toggle={toggle}>
        {['XS', 'S', 'M', 'L', 'XL'].map((val) => (
          <label key={val} className="flex items-center gap-2 font-filson">
            <input
              type="checkbox"
              checked={searchParams.getAll('size').includes(val)}
              onChange={() => handleCheckbox('size', val)}
            />
            {val}
          </label>
        ))}
      </Accordion>

      <Accordion title="Discount" open={open} toggle={toggle}>
        {[10, 20, 30, 40, 50, 60, 70, 80].map((val) => (
          <label key={val} className="flex items-center gap-2 font-filson">
            <input
              type="checkbox"
              checked={searchParams.getAll('discount').includes(val.toString())}
              onChange={() => handleCheckbox('discount', val.toString())}
            />
            {val}% and above
          </label>
        ))}
      </Accordion>

      {/* <Accordion title="Color" open={open} toggle={toggle}>
        {['Red', 'Blue', 'Green', 'Pink', 'Black'].map((val) => (
          <label key={val} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchParams.getAll('color').includes(val)}
              onChange={() => handleCheckbox('color', val)}
            />
            {val}
          </label>
        ))}
      </Accordion> */}

      <Accordion title="Fabric" open={open} toggle={toggle}>
        {['Cotton','Rayon', 'Silk', 'Georgette'].map((val) => (
          <label key={val} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchParams.getAll('fabric').includes(val)}
              onChange={() => handleCheckbox('fabric', val)}
            />
            {val}
          </label>
        ))}
      </Accordion>

      {/* <Accordion title="Neckline" open={open} toggle={toggle}>
        {['V-Neck', 'Round', 'High Neck'].map((val) => (
          <label key={val} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchParams.getAll('neckline').includes(val)}
              onChange={() => handleCheckbox('neckline', val)}
            />
            {val}
          </label>
        ))}
      </Accordion>

      <Accordion title="Sleeve Type" open={open} toggle={toggle}>
        {['Half', 'Full', 'Sleeveless'].map((val) => (
          <label key={val} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchParams.getAll('sleeve').includes(val)}
              onChange={() => handleCheckbox('sleeve', val)}
            />
            {val}
          </label>
        ))}
      </Accordion> */}
    </div>
  );
}
