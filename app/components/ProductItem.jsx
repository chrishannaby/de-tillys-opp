import {Link} from '@remix-run/react';
import {
  Image,
  Money,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {useState} from 'react';

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const [isHovered, setIsHovered] = useState(false);
  const variantUrl = useVariantUrl(product.handle);

  // Get color options with their swatches
  const colorOption = product.options.find(
    option => option.name.toLowerCase() === 'color'
  );

  const colorSwatches = colorOption?.optionValues.map(value => ({
    name: value.name,
    swatch: value.swatch
  })).filter(swatch => swatch.swatch !== null);

  // Get the second image if it exists
  const secondImage = product.images?.nodes?.[1];
  const hasSecondImage = !!secondImage;

  return (
    <Link
      className="product-item relative"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className={`transition-opacity duration-200 !aspect-[4/5] h-full object-contain ${
              isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
        
        {hasSecondImage && (
          <Image
            alt={secondImage.altText || product.title}
            data={secondImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-200 !aspect-[4/5] object-contain ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

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