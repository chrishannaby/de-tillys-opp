import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink
              className='flex justify-center items-center mt-[30px] border border-black w-fit mx-auto uppercase text-[14px] min-w-[85px] px-[10px] py-[13px] rounded-[3px]'
            >
              {isLoading ? 'Loading...' : <span>Load more</span>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
