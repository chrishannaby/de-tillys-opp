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

  // Get color options with their swatches
  const colorOption = product.options.find(
    option => option.name.toLowerCase() === 'color'
  );

  const colorSwatches = colorOption?.optionValues.map(value => ({
    name: value.name,
    swatch: value.swatch
  })).filter(swatch => swatch.swatch !== null);

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

        {colorSwatches && colorSwatches.length > 0 && (
          <div className="flex items-center flex-wrap gap-[8px] mt-1">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="w-[26px] h-[26px] rounded-full relative"
                style={{
                  backgroundColor: swatch.swatch.color || 'transparent',
                  backgroundImage: swatch.swatch.image?.previewImage?.url 
                    ? `url(${swatch.swatch.image.previewImage.url})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                title={swatch.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}