import {ProductItem} from '~/components/ProductItem';
import {useEffect, useState} from 'react';
import {useMatches} from '@remix-run/react';

export function RecommendedProducts({product}) {
  const [recommendations, setRecommendations] = useState([]);
  const matches = useMatches();
  const rootData = matches.find((match) => match.id === 'root')?.data;
  const storefront = rootData?.storefront;

  useEffect(() => {
    if (!product?.id || !storefront) return;

    async function fetchRecommendations() {
      try {
        const {product: productData} = await storefront.query(
          RECOMMENDATIONS_QUERY,
          {
            variables: {
              productId: product.id,
            },
          },
        );

        console.log(productData?.recommendations);

        if (productData?.recommendations) {
          setRecommendations(productData.recommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }

    fetchRecommendations();
  }, [product.id, storefront]);

  if (!recommendations.length || !storefront) return null;

  return (
    <section className="container mx-auto py-[60px]">
      <h2 className="text-[28px] font-[700] mb-[32px]">
        Recommended Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {recommendations.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 2 ? 'eager' : undefined}
          />
        ))}
      </div>
    </section>
  );
}

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations($productId: ID!) {
    product(id: $productId) {
      recommendations(intent: COMPLEMENTARY) {
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
    }
  }
`;