import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?:string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      <CartForm  route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
    </div>
    
  );
}
