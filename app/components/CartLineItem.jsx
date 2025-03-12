import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {Money} from '@shopify/hydrogen';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line, index}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div key={id} className={`flex w-full ${
      Number(index) > 0 ? 'pt-[20px] mt-[20px] border-t border-[#f5f5f5]' : ''
    }`}>
      {image && (
        <Image
          alt={title}
          aspectRatio="4/5"
          data={image}
          height={128}
          loading="lazy"
          width={100}
          className='w-[100px] h-[128px] object-cover mr-[16px]'
        />
      )}

      <div className='flex flex-col flex-1'>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          className='text-[14px] font-[700] mb-[8px] max-w-[200px]'
        >
          {product.title}
        </Link>

        {line.merchandise.id && (
          <p className='text-[14px] font-[700] mb-[8px] max-w-[200px]'>
            Item# {line.merchandise.id.replace('gid://shopify/ProductVariant/', '')}
          </p>
        )}

        <div>
          {selectedOptions.map((option) => (
            <p 
              key={option.name}
              className='mb-[4px] text-[12px] font-[400]'
            >
              {option.name}: {option.value.toUpperCase()}
            </p>
          ))}
        </div>

        <CartLineRemoveButton 
          lineIds={[id]} 
          disabled={!!line.isOptimistic}
          className="cursor-pointer rounded-[2px] border border-black text-[12px] font-[400] text-left mt-[5px] py-[5px] px-[7px]"
        />
      </div>

      <div className='flex gap-[10px] border border-black p-[10px] h-fit max-w-[260px] mr-[50px]'>
        <input 
          type="radio"
          className='w-[20px] h-[20px] border border-black rounded-[2px] accent-black'
          checked
          onChange={() => {}}
        />

        <div>
          <span className='text-[#757575] text-[12px] font-[700] mb-[8px]'>
            Ship It
          </span>

          <p className='text-[12px] font-[400] text-[#757575] mt-[8px] mb-[16px]'>
            Order today and get it by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} with Economy Shipping
          </p>
        </div>
      </div>

      <CartLineQuantity line={line} />

      <div className='flex flex-col min-w-[125px]'>
        <p className='mb-[6px] text-[12px] font-[400]'>
          Total
        </p>
      
        {line?.cost?.totalAmount ? (
          <>
            {line?.cost?.subtotalAmount && line.cost.subtotalAmount.amount > line.cost.totalAmount.amount && (
              <s className="block">
                <Money className="text-[12px] font-[400]" data={line.cost.subtotalAmount} />
              </s>
            )}
            <Money className="text-[12px] font-[400]" data={line.cost.totalAmount} />
          </>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;

  return (
    <div className="flex flex-col min-w-[125px]">
      <p className='mb-[6px] text-[12px] font-[400]'>
        Quantity
      </p>
      
      <div className="flex items-center border border-gray-200 rounded w-fit">
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesUpdate}
          inputs={{
            lines: [{id: lineId, quantity: quantity - 1}],
          }}
        >
          <button
            type="submit"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            className="w-[32px] h-[32px] flex items-center justify-center text-[12px] font-[400] disabled:opacity-50 enabled:cursor-pointer"
          >
            &#8722;
          </button>
        </CartForm>

        <div className="px-2 text-center text-[12px] font-[400]">
          {quantity}
        </div>

        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesUpdate}
          inputs={{
            lines: [{id: lineId, quantity: quantity + 1}],
          }}
        >
          <button
            type="submit"
            aria-label="Increase quantity"
            className="w-[32px] h-[32px] flex items-center justify-center text-[12px] font-[400] enabled:cursor-pointer"
          >
            &#43;
          </button>
        </CartForm>
      </div>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled, className}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        disabled={disabled} 
        type="submit"
        className={className}
      >
        Remove
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lineId: string;
 * }}
 */
function CartLineUpdateButton({children, lineId}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines: [{id: lineId, quantity: 0}], // quantity will be set by select onChange
      }}
    >
      {children}
    </CartForm>
  );
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
