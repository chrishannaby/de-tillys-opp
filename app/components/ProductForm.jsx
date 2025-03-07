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
                      className={`min-w-[85px] py-[13px] px-0 border border-black rounded-[3px] text-[14px] product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
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
            <br />
          </div>
        );
      })}

      <div className='w-full border-t border-[#C4BFC1] mt-[16px] pt-[16px]'></div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        // onClick={() => {
        //   open('cart');
        // }}
        className='w-full'
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
            className={`w-[12px] h-[12px] transition-transform ${isReviewsAccordionOpen ? 'rotate-180' : ''}`}
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
            className={`w-[12px] h-[12px] transition-transform ${isDescriptionAccordionOpen ? 'rotate-180' : ''}`}
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
      className="product-option-label-swatch"
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
