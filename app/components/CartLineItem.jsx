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
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div key={id} className="flex first:pt-0 first:mt-0 first:border-t-0 pt-[20px] mt-[20px] border-t border-[#f5f5f5]">
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
          className='text-[14px] font-[700] mb-[8px]'
        >
          {product.title}
        </Link>

        {line.merchandise.id && (
          <p className='text-[14px] font-[700] mb-[8px]'>
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
      </div>

      <CartLineQuantity line={line} />

      <div className='flex flex-col min-w-[125px]'>
        <p className='mb-[6px] text-[12px] font-[400]'>
          Total
        </p>

        {line?.cost?.totalAmount ? (
          <Money className="text-[12px] font-[400]" data={line.cost.totalAmount} />
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
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
      
      <CartLineUpdateButton lineId={lineId}>
        <select 
          className="text-[12px] font-[400] border border-gray-200 rounded px-2 py-1"
          defaultValue={quantity}
          disabled={!!isOptimistic}
          onChange={(e) => {
            // Submit the closest form when value changes
            e.target.form.submit();
          }}
        >
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            return (
              <option 
                key={value} 
                value={value}
              >
                {value}
              </option>
            );
          })}
        </select>
      </CartLineUpdateButton>
      
      <div className="mt-2">
        <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
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
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
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
