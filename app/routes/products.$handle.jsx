import {useLoaderData, Link, Await} from '@remix-run/react';
import {Suspense} from 'react';
import {defer, json} from '@shopify/remix-oxygen';
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
import {ProductReviews} from '~/components/ProductReviews';

const REVIEWS_ENDPOINT = 'https://chrishannaby-getfootwearreviews.web.val.run';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | Tillys`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const reviewsResponse = await fetch(`${REVIEWS_ENDPOINT}/?handle=${handle}`);
  const reviews = {
    data: await reviewsResponse.json(),
  };

  const recommendedProducts = await context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return json({
    product,
    recommendedProducts,
    reviews,
  });
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendedProducts, reviews} = useLoaderData();

  // Use useEffect to update selectedImage when product changes
  useEffect(() => {
    setSelectedImage(product.selectedOrFirstAvailableVariant?.image);
  }, [product.id]); // Reset when product ID changes

  const [selectedImage, setSelectedImage] = useState(
    product.selectedOrFirstAvailableVariant?.image,
  );

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
        <Link to="/">Home</Link>/<Link to="/collections/all">Collection</Link>/
        <span>{title}</span>
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
                  selectedImage?.id === image.id
                    ? 'border border-black'
                    : 'border border-gray-200'
                }`}
              >
                <Image
                  alt={image.altText || product.title}
                  data={image}
                  loading="lazy"
                  sizes="80px"
                  className="w-full h-full object-contain"
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
          <h1 className="text-[28px] font-[700] mb-[8px]">{title}</h1>

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
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-[18.4px] font-[700] my-[16px] text-center">
          Reviews
        </h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={reviews}>
            {(reviews) => <ProductReviews reviews={reviews.data} />}
          </Await>
        </Suspense>
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
