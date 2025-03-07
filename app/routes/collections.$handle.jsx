import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useNavigate} from '@remix-run/react';
import {
  getPaginationVariables,
  Analytics,
} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'MANUAL'; // Default sort
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey: sort,
        reverse: false,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
    sort,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  const {collection, sort} = useLoaderData();
  const navigate = useNavigate();

  const handleSortChange = (event) => {
    const newSort = event.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set('sort', newSort);
    navigate(url.pathname + url.search);
  };

  const sortOptions = {
    MANUAL: 'Featured',
    TITLE: 'Alphabetically',
    PRICE: 'Price',
    BEST_SELLING: 'Best selling'
  };

  return (
    <div className="container mx-auto mt-[16px] mb-[30px]">

      {/* Header */}
      <div className='flex items-center justify-between mb-[10px] pb-[25px]'>
        {/* Left */}
        <div className='flex flex-col'>
          <div className='flex items-center gap-[10px]'>
            <h1 className='text-[20px] font-bold'>
              {collection.title}
            </h1>
          </div>

          {/* Breadcrumbs */}
          <div className='flex items-center gap-[8px] text-[11px] font-[400]'>
            <Link to="/">
              Home
            </Link>

            <span>
              /
            </span>

            <Link to={`/collections/${collection.handle}`}>
              {collection.title}
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center gap-[10px]'>
        <label 
            htmlFor="sort" 
            className="text-[16px] font-[400]"
          >
            Sort:
          </label>

          <select
            id="sort"
            className="w-[200px] h-[38px] py-[6px] pl-[12px] pr-[35px] border border-[gray] rounded-[4px] text-[16px] font-[400] text-[#495057]"  
            value={sort}
            onChange={handleSortChange}
          >
            <option value="MANUAL">Featured</option>
            <option value="TITLE">Alphabetically</option>
            <option value="PRICE">Price</option>
            <option value="BEST_SELLING">Best selling</option>
          </select>
        </div>
      </div>

      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          id
          selectedOptions {
            name
            value
          }
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
