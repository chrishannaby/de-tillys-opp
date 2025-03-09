import {CartForm, Money} from '@shopify/hydrogen';
import {useRef, useState} from 'react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div className='min-w-[300px]'>
      <h4 className='text-[16px] font-[700] mb-[20px] pb-[10px] border-b border-black'>
        Order Summary
      </h4>

      <div className='flex flex-col gap-[24px]'>
        {cart.cost?.subtotalAmount && (
          <div className='flex justify-between text-[16px] font-[500]'>
            <p>
              Subtotal
            </p>

            <span>
              <Money data={cart.cost.subtotalAmount} />
            </span>
          </div>
        )}

        <div className='flex justify-between text-[16px] font-[500]'>
          <p>
            Estimated Tax
          </p>

          <span>
            $0.00
          </span>
        </div>

        {cart.cost?.totalAmount && (
          <div className='flex justify-between text-[16px] font-[500]'>
            <p>
              Estimated Total
            </p>

            <span>
              <Money data={cart.cost?.totalAmount} />
            </span>
          </div>
        )}
      </div>
      
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />

      <p className='mt-[16px] mb-[4px] text-[12px] font-[400] text-center'>
        By placing your order, you agree to Tillys <a href="/" className='text-[#205263]'>privacy policy</a> and <a href="/" className='text-[#205263]'>terms of use</a>.
      </p>
    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className='uppercase flex items-center justify-center gap-[8px] py-[10px] px-[22px] bg-black text-center text-white text-[14px] font-[700] rounded-[3px]'
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      
      Continue to Checkout
    </a>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button 
        className="w-full flex items-center justify-between py-[16px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[16px] font-[700]">
          Add Promo Code
        </span>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-200 ${isOpen ? 'max-h-40' : 'max-h-0 overflow-hidden'}`}>
        {/* Have existing discount, display it with a remove option */}
        <dl hidden={!codes.length}>
          <div className="mb-4">
            <dt className="text-[12px] text-gray-500 mb-2">Applied Discount(s)</dt>
            <UpdateDiscountForm>
              <div className="cart-discount flex items-center gap-2">
                <code className="text-[14px]">{codes?.join(', ')}</code>
                <button className="text-[12px] text-red-500">Remove</button>
              </div>
            </UpdateDiscountForm>
          </div>
        </dl>

        {/* Show an input to apply a discount */}
        <UpdateDiscountForm discountCodes={codes}>
          <p className='text-[16px] font-[400] mb-[6px]'>
            Promo Code
          </p>

          <div className="flex gap-[24px] h-[28px] mb-[20px]">
            <input 
              type="text" 
              name="discountCode" 
              placeholder="Enter promo code" 
              className="flex-1 py-[6px] px-[10px] bg-white text-black rounded-[3px] border border-[gray]"
            />

            <button 
              type="submit"
              className="flex items-center justify-center font-[700] bg-black text-white py-[4px] px-0 text-center cursor-pointer w-full rounded-[3px]"
            >
              Apply
            </button>
          </div>
        </UpdateDiscountForm>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];
  const [isOpen, setIsOpen] = useState(false);

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      <button 
        className="w-full flex items-center justify-between py-[16px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[16px] font-[700]">
          Add Gift Card
        </span>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-200 ${isOpen ? 'max-h-40' : 'max-h-0 overflow-hidden'}`}>
        {/* Have existing gift card applied, display it with a remove option */}
        <dl hidden={!codes.length}>
          <div className="mb-4">
            <dt className="text-[12px] text-gray-500 mb-2">Applied Gift Card(s)</dt>
            <UpdateGiftCardForm>
              <div className="cart-discount flex items-center gap-2">
                <code className="text-[14px]">{codes?.join(', ')}</code>
                <button className="text-[12px] text-red-500" onSubmit={() => removeAppliedCode}>Remove</button>
              </div>
            </UpdateGiftCardForm>
          </div>
        </dl>

        {/* Show an input to apply a gift card */}
        <UpdateGiftCardForm
          giftCardCodes={appliedGiftCardCodes.current}
          saveAppliedCode={saveAppliedCode}
        >
          <p className='text-[16px] font-[400] mb-[6px]'>
            Gift Card
          </p>

          <div className="flex gap-[24px] h-[28px] mb-[20px]">
            <input 
              type="text"
              name="giftCardCode"
              placeholder="Enter gift card code"
              ref={giftCardCodeInput}
              className="flex-1 py-[6px] px-[10px] bg-white text-black rounded-[3px] border border-[gray]"
            />

            <button 
              type="submit"
              className="flex items-center justify-center font-[700] bg-black text-white py-[4px] px-0 text-center cursor-pointer w-full rounded-[3px]"
            >
              Apply
            </button>
          </div>
        </UpdateGiftCardForm>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({giftCardCodes, saveAppliedCode, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
