import {ProductItem} from '~/components/ProductItem';
import {Suspense, useMemo} from 'react';
import {Await} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export function RecommendedProducts({products, title = "Recommended Products"}) {
  return (
    <section className="container mx-auto py-[16px]">
      <h2 className="text-[18.4px] font-[700] my-[16px] text-center">
        {title}
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            // Get all products
            const allProducts = response?.products?.nodes || [];
            if (allProducts.length === 0) return null;

            // Memoize the randomized products
            const randomProducts = useMemo(() => {
              return [...allProducts]
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);
            }, [allProducts.map(p => p.id).join(',')]); // Only re-randomize if products change

            return (
              <div className="grid grid-cols-6 gap-[30px]">
                {randomProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 2 ? 'eager' : undefined}
                  />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
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
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: UPDATED_AT, reverse: true) { # Fetch 20 products instead of 6
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

export {RECOMMENDED_PRODUCTS_QUERY};