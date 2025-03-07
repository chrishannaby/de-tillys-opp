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

  // Get unique color options
  const colorOptions = product.variants?.nodes
    ?.map(variant => variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'color')?.value)
    .filter((color, index, self) => color && self.indexOf(color) === index);

  console.log(product);

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

        {colorOptions && colorOptions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {colorOptions.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{backgroundColor: color.toLowerCase()}}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}