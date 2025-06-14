// /lib/filterUtils.ts

type ProductSortKeys = 'TITLE' | 'RELEVANCE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';

// ✅ Build tag filter with prefix like: tag:"Fabric:Rayon"
export const buildTagFilter = (name: string, values: string[]) => {
  if (!values.length) return '';
  return values.map(val => `tag:"${name}:${val}" `).join('');
};

// ✅ Parse sort parameter from URL to Shopify sortKey + reverse
export const parseSort = (sort: string | null): { sortKey: ProductSortKeys; reverse: boolean } => {
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
