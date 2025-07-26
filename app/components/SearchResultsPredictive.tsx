import {Link, useFetcher, type Fetcher} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

export function SearchResultsPredictive({
  children,
}: {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
}) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = function ({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <div className="space-y-2 mb-6" key="articles">
      <h5 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">
        Articles
      </h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const url = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li
              className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded"
              key={article.id}
            >
              <Link to={url} onClick={closeSearch} className="flex items-center gap-3">
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                    className="rounded border"
                  />
                )}
                <span className="text-sm font-medium text-gray-800">{article.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Collections = function ({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="space-y-2 mb-6" key="collections">
      <h5 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">
        Collections
      </h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const url = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li
              className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded"
              key={collection.id}
            >
              <Link to={url} onClick={closeSearch} className="flex items-center gap-3">
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={50}
                    height={50}
                    className="rounded border"
                  />
                )}
                <span className="text-sm font-medium text-gray-800">{collection.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Pages = function ({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="space-y-2 mb-6" key="pages">
      <h5 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">
        Pages
      </h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const url = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li
              className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded"
              key={page.id}
            >
              <Link to={url} onClick={closeSearch}>
                <span className="text-sm font-medium text-gray-800">{page.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Products = function ({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="space-y-2 mb-6" key="products">
      <h5 className="text-base font-semibold text-gray-700 border-b pb-1 mb-2">
        Products
      </h5>
      <ul className="space-y-2">
        {products.map((product) => {
          const url = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product.selectedOrFirstAvailableVariant?.price;
          const image = product.selectedOrFirstAvailableVariant?.image;

          return (
            <li
              className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded"
              key={product.id}
            >
              <Link to={url} onClick={closeSearch} className="flex items-center gap-3">
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={50}
                    height={50}
                    className="rounded border"
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-800">{product.title}</p>
                  <small className="text-xs text-gray-600">{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SearchResultsPredictive.Queries = function ({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((q) => q && <option key={q.text} value={q.text} />)}
    </datalist>
  );
};

SearchResultsPredictive.Empty = function ({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) return null;

  return (
    <div className="text-center text-gray-500 py-10">
      <p className="text-sm">No results found for</p>
      <p className="text-md font-semibold text-gray-700 mt-1">&ldquo;{term.current}&rdquo;</p>
    </div>
  );
};

function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
