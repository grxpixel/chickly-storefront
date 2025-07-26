import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { OrderNoteSection } from './OrderNoteSection';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount ?? 0).toLocaleString('en-IN');
  const checkoutUrl = cart?.checkoutUrl ?? '#';
  const discountCodes = cart?.discountCodes ?? [];
  const appliedGiftCards = cart?.appliedGiftCards ?? [];

  return (
    <div aria-labelledby="cart-summary" className="mt-4">
      {/* Subtotal */}
      {/* <div className="flex justify-between mb-2">
        <span className="font-semibold">Subtotal</span>
        <span>₹{subtotal}</span>
      </div> */}

      {/* Discount Codes */}
      {/* <CartDiscounts discountCodes={discountCodes} /> */}

      {/* Gift Card Codes */}
      {/* <CartGiftCard giftCardCodes={appliedGiftCards} /> */}

      {/* Discount */}
      <div className="text-base mb-2 font-poppins text-center">
        5% Extra Discount on Prepaid Orders Use Code: <strong>PREPAID</strong>
      </div>

      {/* Order Note & Shipping Info */}
      <div className="checkout-button flex flex-col gap-2 border-t border-t-gray-200 pt-4 mt-4">

        <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-700/50 font-filson pr-2 w-full text-right">
          Shipping & taxes calculated at checkout
        </span>
      </div>
   {/* Gift Card Again */}
      <div className="checkout-button-gift-card">
        <div className="flex items-center mb-4">
        <input type="checkbox" id="giftcard2" className="mr-2" />
        <label htmlFor="giftcard2" className="text-sm foont-filson">Pay Via Gift Card</label>
      </div>


      {/* Checkout Button */}
      <a href={checkoutUrl} target="_self">
        <p className='w-full py-3 bg-[#f05d78] text-white font-semibold text-lg rounded text-center mt-4'>
          CHECKOUT • ₹{subtotal}
        </p>
      </a>
      </div>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const appliedCodes =
    discountCodes?.filter((d) => d.applicable)?.map((d) => d.code) || [];

  return (
    <div className="my-2">
      {appliedCodes.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Discount Applied:</span>
          {appliedCodes.map((code, index) => (
            <div key={index} className="flex justify-between items-center mt-1">
              <code>{code}</code>
              <UpdateDiscountForm discountCodes={[]}>
                <button type="submit" className="text-sm text-red-600 underline">Remove</button>
              </UpdateDiscountForm>
            </div>
          ))}
        </div>
      )}

      <UpdateDiscountForm discountCodes={appliedCodes}>
        <div className="flex mt-2 gap-2">
          <input type="text" name="discountCode" placeholder="Discount code" className="border p-1 flex-1" />
          <button type="submit" className="bg-black text-white px-3 rounded">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
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

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'];
}) {
  const appliedCodes = giftCardCodes?.map((g) => `***${g.lastCharacters}`) || [];

  return (
    <div className="my-2">
      {appliedCodes.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Gift Card Applied:</span>
          {appliedCodes.map((code, index) => (
            <div key={index} className="flex justify-between items-center mt-1">
              <code>{code}</code>
              <UpdateGiftCardForm giftCardCodes={[]}>
                <button type="submit" className="text-sm text-red-600 underline">Remove</button>
              </UpdateGiftCardForm>
            </div>
          ))}
        </div>
      )}

      <UpdateGiftCardForm giftCardCodes={appliedCodes}>
        <div className="flex mt-2 gap-2">
          <input type="text" name="giftCardCode" placeholder="Gift card code" className="border p-1 flex-1" />
          <button type="submit" className="bg-black text-white px-3 rounded">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  children,
}: {
  giftCardCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}






 