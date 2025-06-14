import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulates previous and next behaviors.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            {/* Previous link if needed */}
            <div className="flex justify-center my-6">
              <PreviousLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <button className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">
                    ↑ Load Previous
                  </button>
                )}
              </PreviousLink>
            </div>

            {/* Product Grid */}
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}

            {/* Next Link (Load More Button) */}
            <div className="flex justify-center my-10">
              <NextLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <button className="inline-block px-8 py-3 rounded-full bg-black text-white text-sm font-semibold tracking-wide shadow-lg hover:bg-gray-900 transition-colors duration-300">
                    Load More
                  </button>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
