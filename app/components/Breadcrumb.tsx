import React from 'react';
import { Link } from '@remix-run/react';

type BreadcrumbItem = {
  label: string;
  url?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};


const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null;
  

  return (
    <nav aria-label="breadcrumb" className="my-4">
      <ol className="flex flex-wrap text-sm text-gray-500 space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center font-filson">
            {index !== 0 && <span className="mx-1 text-gray-400">/</span>}
            {item.url ? (
              <Link to={item.url} className="hover:text-black font-filson">
                {item.label}
              </Link>
            ) : (
              <span className="text-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
