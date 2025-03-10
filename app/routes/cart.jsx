import {useLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {data, json} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/CartMain';
import {CartSummary} from '~/components/CartSummary';
import {RecommendedProducts} from '~/sections/recommended-products';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/sections/recommended-products';

import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Cart | Tillys`}];
};

/**
 * @type {HeadersFunction}
 */
export const headers = ({actionHeaders}) => actionHeaders;

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;
  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId: cartResult.id,
      },
    },
    {status, headers},
  );
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {cart} = context;

  // Load cart data
  const cartData = await cart.get();

  // Load recommended products
  const recommendedProducts = await context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    ...cartData,
    recommendedProducts
  };
}

export default function Cart() {
  const {recommendedProducts, ...originalCart} = useLoaderData();
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = cart?.totalQuantity && cart?.totalQuantity > 0;

  if (!cartHasItems) {
    return (
      <div className="container mx-auto pt-[120px] pb-[120px]">
        <h1 className="text-center text-[40px] font-[700] mb-[8px]">
          Your Shopping Bag is Empty
        </h1>

        <p className='text-center text-[16px] font-[400]'>
          Need help filling your bag? We have hand picked some items to get you started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto pt-[16px] flex gap-[16px]">
        {/* Shopping Bag */}
        <div className='w-full'>
          <div className='flex items-center justify-between mb-[20px] pb-[10px] border-b border-black'>
            <h1 className='text-[16px] font-[700]'>
              Shopping Bag
            </h1>

            <p className='text-[12px] font-[300]'>
              Need Help? Call <a className='underline' href="tel:18664845597">1-866-484-5597</a>
            </p>
          </div>

          {(cart?.lines?.nodes ?? []).map((line, index) => (
            <CartLineItem key={line.id} line={line} index={index} />
          ))}
        </div>

        <CartSummary cart={cart} />
      </div>

      {/* Recommended Products Section */}
      <RecommendedProducts 
        products={recommendedProducts} 
        title="You might be interested in these items"
      />
    </>
  );
}

/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').HeadersFunction} HeadersFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
