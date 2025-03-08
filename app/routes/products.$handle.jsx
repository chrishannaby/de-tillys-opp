import {useLoaderData, Link} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {RecommendedProducts} from '~/sections/recommended-products';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/sections/recommended-products';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendedProducts} = useLoaderData();
  
  // Use useEffect to update selectedImage when product changes
  useEffect(() => {
    setSelectedImage(product.selectedOrFirstAvailableVariant?.image);
  }, [product.id]); // Reset when product ID changes

  const [selectedImage, setSelectedImage] = useState(product.selectedOrFirstAvailableVariant?.image);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-[8px] text-[11px] font-[400] py-[20px] px-[8px]">
        <Link to="/">
          Home
        </Link>

        /

        <Link to="/collections/all">
          Collection
        </Link>

        /

        <span>
          {title}
        </span>
      </div>

      <div className="product gap-[48px] mb-[16px]">
        <div className="flex gap-[30px]">
          {/* Vertical Image Gallery */}
          <div className="flex flex-col gap-[10px]">
            {product.images?.nodes.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`w-[80px] h-[100px] overflow-hidden cursor-pointer hover:border-2 hover:border-black ${
                  selectedImage?.id === image.id ? 'border border-black' : 'border border-gray-200'
                }`}
              >
                <Image
                  alt={image.altText || product.title}
                  data={image}
                  loading="lazy"
                  sizes="80px"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Product Image */}
          <ProductImage 
            image={selectedImage || selectedVariant?.image}
            className="flex-1"
          />
        </div>
        
        <div className="product-main">
          <h1 className="text-[28px] font-[700] mb-[8px]">
            {title}
          </h1>

          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <ProductForm
            product={product}
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            descriptionHtml={descriptionHtml}
          />
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>

      <RecommendedProducts products={recommendedProducts} />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
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
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
