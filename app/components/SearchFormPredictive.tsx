import {
  useFetcher,
  useNavigate,
  type FormProps,
  type Fetcher,
} from '@remix-run/react';
import React, {useRef, useEffect} from 'react';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';

export const SEARCH_ENDPOINT = '/search';

type SearchFormPredictiveProps = Omit<FormProps, 'children'>;

export function SearchFormPredictive({
  className = '',
  ...props
}: SearchFormPredictiveProps) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const aside = useAside();

  /** Reset input focus on submit */
  function resetInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    inputRef?.current?.blur();
  }

  /** Navigate to search results page */
  function goToSearch() {
    const term = inputRef?.current?.value;
    navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
    aside.close();
  }

  /** Fetch predictive search results */
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    fetcher.submit(
      {q: event.target.value || '', limit: 5, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }

  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  return (
    <fetcher.Form
      {...props}
      className={`w-full max-w-xl relative ${className}`}
      onSubmit={resetInput}
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          onChange={fetchResults}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              goToSearch();
            }
          }}
          placeholder="Search for products, categories or fabric..."
          className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-black/10 focus:outline-none text-sm bg-white shadow-sm transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.25 3a7.5 7.5 0 015.4 12.65z"
            />
          </svg>
        </div>
      </div>
    </fetcher.Form>
  );
}
