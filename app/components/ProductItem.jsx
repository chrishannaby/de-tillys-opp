import {Link} from '@remix-run/react';
import {
  Image,
  Money,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
*   product: ProductItemFragment;
*   loading?: 'eager' | 'lazy';
* }}
*/
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="4/5"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}

      <div className='mt-[15px] mb-[16px]'>
        <h4 className='text-[12px] font-[400]'>
          {product.title}
        </h4>

        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}