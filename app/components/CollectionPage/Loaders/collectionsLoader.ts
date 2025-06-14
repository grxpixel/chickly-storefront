import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { COLLECTION_QUERY } from '../lib/queries';

// Define all supported Shopify Sort Keys
type ProductSortKeys = 'TITLE' | 'RELEVANCE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';

// Utility for mapping tags with prefix
const buildTagFilter = (name: string, values: string[]) => {
  return values.map(val => `tag:"${name}:${val}" `).join('');
};

// Utility for sorting
const parseSort = (sort: string | null): { sortKey: ProductSortKeys, reverse: boolean } => {
  switch (sort) {
    case 'title-asc': return { sortKey: 'TITLE', reverse: false };
    case 'title-desc': return { sortKey: 'TITLE', reverse: true };
    case 'price-asc': return { sortKey: 'PRICE', reverse: false };
    case 'price-desc': return { sortKey: 'PRICE', reverse: true };
    case 'created-asc': return { sortKey: 'CREATED_AT', reverse: false };
    case 'created-desc': return { sortKey: 'CREATED_AT', reverse: true };
    case 'best-selling': return { sortKey: 'BEST_SELLING', reverse: false };
    default: return { sortKey: 'RELEVANCE', reverse: false };
  }
};

export async function collectionsLoader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const pageBy = 12;
  const after = searchParams.get('after');
  const before = searchParams.get('before');
  const reverse = !!before;

  const size = searchParams.getAll('size');
  const color = searchParams.getAll('color');
  const fabric = searchParams.getAll('fabric');
  const neckline = searchParams.getAll('neckline');
  const sleeve = searchParams.getAll('sleeve');
  const discount = searchParams.getAll('discount');
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const sort = searchParams.get('sort');

  const {sortKey, reverse: reverseSort} = parseSort(sort);

  let filterQuery = '';

  if (size.length) size.forEach(val => filterQuery += `variants.option:"Size:${val}" `);
  filterQuery += buildTagFilter('Color', color);
  filterQuery += buildTagFilter('Fabric', fabric);
  filterQuery += buildTagFilter('Neckline', neckline);
  filterQuery += buildTagFilter('Sleeve', sleeve);

  if (priceMin) filterQuery += `variants.price:>=${priceMin} `;
  if (priceMax) filterQuery += `variants.price:<=${priceMax} `;

  const products = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      query: filterQuery.trim() || null,
      first: pageBy,
      after,
      before,
      sortKey,
      reverse: reverseSort
    },
  });

  return defer({
    products,
    discountFilters: discount,
    searchParams: Object.fromEntries(searchParams),
  });
}
