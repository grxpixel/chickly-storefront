import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `flex cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div className='cart-drawer-products ' aria-labelledby="cart-lines">
          <ul className='min-h-96 overflow-x-hidden overflow-y-auto flex-grow pb-6'>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

type CartEmptyProps = {
  hidden?: boolean;
  layout?: any; // optional, not used in this design
};

export function CartEmpty({hidden = false}: CartEmptyProps) {
  const {close} = useAside();

  return (
    <div
      hidden={hidden}
      className="flex flex-col items-center justify-center h-full text-center py-20 px-6"
    >
      {/* Icon or image */}
      <div className="w-full h-auto mb-6">
        <img
          src="/app/assets/Icons/cart.png"
          alt="Empty Cart"
          className="w-full h-full object-contain opacity-80"
        />
      </div>

      {/* Heading */}
      {/* <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
        Your bag is empty!
      </h2> */}

      {/* Subtext */}
      {/* <p className="text-gray-600 text-base max-w-md mb-6">
        Looks like you haven’t added anything yet. Don’t worry — your perfect pick is just a scroll away.
      </p> */}

      {/* CTA Button */}
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="bg-black text-white px-6 py-3 rounded-full text-sm md:text-base font-medium hover:bg-gray-900 transition-all duration-200 shadow-sm"
      >
        🛍️ Continue Shopping
      </Link>
    </div>
  );
}