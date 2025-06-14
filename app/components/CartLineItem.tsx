import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from './Aside';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const variant = selectedOptions.map(o => o.value).join(', ');

  return (
    <li key={id} className="flex items-start gap-3 py-4 border-b last:border-b-0">
      {image && (
        <Image
          alt={title}
          aspectRatio="3/4"
          data={image}
          width={80}
          height={80}
          className="rounded object-cover"
        />
      )}

      <div className="flex flex-col flex-1">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => { if (layout === 'aside') { close(); } }}
          className="font-poppins text-lg leading-snug"
        >
          {product.title}
        </Link>

        <div className="text-sm font-filson text-gray-500 mb-2">{variant}</div>

        <div className="flex font-filson items-center gap-2">
          <QuantityControls line={line} />
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>
      </div>

      <div className="font-semibold text-black/80 font-poppins text-base whitespace-nowrap pl-3">
        ₹{Number(line?.cost?.totalAmount?.amount ?? 0).toLocaleString('en-IN')}
      </div>
    </li>
  );
}

function QuantityControls({line}: {line: CartLine}) {
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(quantity - 1, 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="flex items-center border border-black/20 rounded">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className="w-8 h-8 flex items-center justify-center text-lg"
          disabled={quantity <= 1 || !!isOptimistic}
        >-</button>
      </CartLineUpdateButton>

      <div className="px-3 text-sm">{quantity}</div>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="w-8 h-8 flex items-center justify-center text-lg"
          disabled={!!isOptimistic}
        >+</button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit" className="text-xs underline text-gray-500">
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
