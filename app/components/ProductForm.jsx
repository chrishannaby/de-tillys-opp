import {Link, useNavigate} from '@remix-run/react';
import {useState} from 'react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({product, productOptions, selectedVariant, descriptionHtml}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const [isReviewsAccordionOpen, setIsReviewsAccordionOpen] = useState(true);
  const [isDescriptionAccordionOpen, setIsDescriptionAccordionOpen] = useState(true);

  const handleAddToCart = () => {
    // Dispatch custom event when item is added to cart
    const event = new CustomEvent('cartItemAdded', {
      detail: {
        title: product.title
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="product-form mt-[8px]">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options pt-[16px]" key={option.name}>
            <h5 className="text-[14px] font-[700] mb-[20px]">
              {option.name}
            </h5>

            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links

                  return (
                    <button
                      type="button"
                      className={`cursor-pointer product-options-item
                        ${exists && !selected ? ' link' : ''}
                        ${swatch?.color 
                          ? 'h-[32px] w-[32px] rounded-full overflow-hidden' 
                          : 'min-w-[85px] py-[13px] px-0 border border-black rounded-[3px] text-[14px]'
                        }
                        ${selected && swatch?.color ? 'outline outline-2 outline-black outline-offset-3' : ''}
                      `}
                      key={option.name + name}
                      style={{
                        backgroundColor: selected ? '#000' : 'transparent',
                        color: selected ? '#fff' : '#000',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>

            {option.name === 'Size' && (
              <p className="text-[14px] underline mt-[20px] mb-[24px] cursor-pointer">
                Size Chart
              </p>
            )}
          </div>
        );
      })}

      <div className='w-full border-t border-[#C4BFC1] mt-[16px] pt-[16px]'></div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        className='w-full'
        onClick={handleAddToCart}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      {/* Reviews Accordion */}
      <div className="border-t border-[#C4BFC1] mt-[16px] pt-[16px]">
        <button 
          className="w-full flex justify-between items-center pb-[10px] cursor-pointer"
          onClick={() => setIsReviewsAccordionOpen(!isReviewsAccordionOpen)}
        >
          <span className="text-[14px] font-[700]">Reviews</span>

          <svg 
            className={`w-[16px] h-[16px] transition-transform ${isReviewsAccordionOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12" 
            fill="none"
          >
            <path d="M2 4L6 8L10 4" stroke="black" strokeWidth="1.5"/>
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all ${isReviewsAccordionOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="flex flex-col pb-[16px] text-[14px] pt-[10px]">
            <p className='underline text-[14px] font-[400]'>
              Be the first to write a review
            </p>
            <p className='text-[14px] font-[400]'>
              | <span className='underline'>Be the first to ask a question</span>
            </p>
          </div>
        </div>
      </div>

      {/* Description Accordion */}
      <div className="border-t border-[#C4BFC1] mt-[16px] pt-[16px]">
        <button 
          className="w-full flex justify-between items-center pb-[10px] cursor-pointer"
          onClick={() => setIsDescriptionAccordionOpen(!isDescriptionAccordionOpen)}
        >
          <div className='flex items-center gap-[10px]'>
            <span className="text-[14px] font-[700]">Product Details</span>
            <span className='text-[13px] font-[700] text-[#757575]'>
              item no. {product.id.replace('gid://shopify/Product/', '')}
            </span>
          </div>
          
          <svg 
            className={`w-[16px] h-[16px] transition-transform ${isDescriptionAccordionOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12" 
            fill="none"
          >
            <path d="M2 4L6 8L10 4" stroke="black" strokeWidth="1.5"/>
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all ${isDescriptionAccordionOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="pb-[16px] text-[14px]">
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          </div>
        </div>
      </div>

      <div className='w-full border-t border-[#C4BFC1] mt-[16px] pt-[16px]'></div>

      {/* Social Icons */}
      <div className='flex gap-[10px] mt-[6px]'>
        <a 
          href="mailto:?subject=Check this out on Tillys.com&amp;" 
          className='w-[40px] h-[40px] rounded-full overflow-hidden bg-black flex items-center justify-center'
        >
          <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M256 352c-16.53 0-33.06-5.422-47.16-16.41L0 173.2V400C0 426.5 21.49 448 48 448h416c26.51 0 48-21.49 48-48V173.2l-208.8 162.5C289.1 346.6 272.5 352 256 352zM16.29 145.3l212.2 165.1c16.19 12.6 38.87 12.6 55.06 0l212.2-165.1C505.1 137.3 512 125 512 112C512 85.49 490.5 64 464 64h-416C21.49 64 0 85.49 0 112C0 125 6.01 137.3 16.29 145.3z"/></svg>
        </a>

        <a 
          href="https://www.facebook.com/Tillys"
          className='w-[40px] h-[40px] rounded-full overflow-hidden bg-black flex items-center justify-center'
        >
          <svg 
            width="20"
            height="20"
            viewBox="0 0 512 512"
            style={{
              fillRule: 'evenodd',
              clipRule: 'evenodd',
              strokeLinejoin: 'round',
              strokeMiterlimit: 2
            }}
          >
            <path 
              d="M374.245,285.825l14.104,-91.961l-88.233,0l0,-59.677c0,-25.159 12.325,-49.682 51.845,-49.682l40.117,0l0,-78.291c0,0 -36.408,-6.214 -71.214,-6.214c-72.67,0 -120.165,44.042 -120.165,123.775l0,70.089l-80.777,0l0,91.961l80.777,0l0,222.31c16.197,2.542 32.798,3.865 49.709,3.865c16.911,0 33.512,-1.323 49.708,-3.865l0,-222.31l74.129,0Z"
              style={{
                fill: 'white',
                fillRule: 'nonzero'
              }}
            />
          </svg>
        </a>
        
        <a 
          href="https://pinterest.com/tillys/"
          className='w-[40px] h-[40px] rounded-full overflow-hidden bg-black flex items-center justify-center'
        >
          <svg width="20" height="20" viewBox="0 0 512 512"><path fill="white" d="M255.998,0.001c-141.384,0 -255.998,114.617 -255.998,255.998c0,108.456 67.475,201.171 162.707,238.471c-2.24,-20.255 -4.261,-51.405 0.889,-73.518c4.65,-19.978 30.018,-127.248 30.018,-127.248c0,0 -7.659,-15.334 -7.659,-38.008c0,-35.596 20.632,-62.171 46.323,-62.171c21.839,0 32.391,16.399 32.391,36.061c0,21.966 -13.984,54.803 -21.203,85.235c-6.03,25.482 12.779,46.261 37.909,46.261c45.503,0 80.477,-47.976 80.477,-117.229c0,-61.293 -44.045,-104.149 -106.932,-104.149c-72.841,0 -115.597,54.634 -115.597,111.095c0,22.004 8.475,45.596 19.052,58.421c2.09,2.535 2.398,4.758 1.776,7.343c-1.945,8.087 -6.262,25.474 -7.111,29.032c-1.117,4.686 -3.711,5.681 -8.561,3.424c-31.974,-14.884 -51.963,-61.627 -51.963,-99.174c0,-80.755 58.672,-154.915 169.148,-154.915c88.806,0 157.821,63.279 157.821,147.85c0,88.229 -55.629,159.232 -132.842,159.232c-25.94,0 -50.328,-13.476 -58.674,-29.394c0,0 -12.838,48.878 -15.95,60.856c-5.782,22.237 -21.382,50.109 -31.818,67.11c23.955,7.417 49.409,11.416 75.797,11.416c141.389,0 256.003,-114.612 256.003,-256.001c0,-141.381 -114.614,-255.998 -256.003,-255.998Z"/></svg>
        </a>

        <a 
          href="https://twitter.com/tillys" 
          data-share="twitter" 
          title="Share a link to FULL TILT Queen of Thorns Womens Baby Tee on Twitter"
          className='w-[40px] h-[40px] rounded-full overflow-hidden bg-black flex items-center justify-center'
        >
          <svg width="20" height="20" viewBox="0 0 32 32"><path d="M31.993,6.077C30.816,6.6,29.552,6.953,28.223,7.11c1.355-0.812,2.396-2.098,2.887-3.63  c-1.269,0.751-2.673,1.299-4.168,1.592C25.744,3.797,24.038,3,22.149,3c-3.625,0-6.562,2.938-6.562,6.563  c0,0.514,0.057,1.016,0.169,1.496C10.301,10.785,5.465,8.172,2.227,4.201c-0.564,0.97-0.888,2.097-0.888,3.3  c0,2.278,1.159,4.286,2.919,5.464c-1.075-0.035-2.087-0.329-2.972-0.821c-0.001,0.027-0.001,0.056-0.001,0.082  c0,3.181,2.262,5.834,5.265,6.437c-0.55,0.149-1.13,0.23-1.729,0.23c-0.424,0-0.834-0.041-1.234-0.117  c0.834,2.606,3.259,4.504,6.13,4.558c-2.245,1.76-5.075,2.811-8.15,2.811c-0.53,0-1.053-0.031-1.566-0.092  C2.905,27.913,6.355,29,10.062,29c12.072,0,18.675-10.001,18.675-18.675c0-0.284-0.008-0.568-0.02-0.85  C30,8.55,31.112,7.395,31.993,6.077z" fill="white"/></svg>
        </a>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch w-[32px] h-[32px]"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
