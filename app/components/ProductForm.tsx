import {Link, useNavigate} from '@remix-run/react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {Maybe, ProductOptionValueSwatch} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {useState} from 'react';
import Breadcrumb from './Breadcrumb';

export function ProductForm({
  productOptions,
  selectedVariant,
  variants,
  className
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  variants: Array<ProductVariantFragment>;
  className?:string;
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Product Options */}
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="mb-4" key={option.name}>
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-black">Size:</div>
              <div className="text-rose-500/70 text-sm cursor-pointer flex justify-center items-center flex-nowrap gap-2">Size chart <img src="/app/assets/Icons/Vector_12.png" alt="icon" /></div>
            </div>

            <div className="flex flex-wrap gap-2">
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

                const commonClasses = `px-4 py-2 border rounded-xl cursor-pointer text-sm font-medium transition-all ${
                  selected ? 'bg-rose-500/70 text-white' : 'bg-white text-black border-gray-300'
                } ${!available ? 'opacity-30' : ''}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={commonClasses}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      key={option.name + name}
                      className={commonClasses}
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
          </div>
        );
      })}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <div className="font-bold font-filson text-black">Quantity:</div>
        <div className="flex items-center border rounded-lg">
          <button onClick={decreaseQty} className="w-8 h-12 flex justify-center items-center text-xl font-bold text-black cursor-pointer">-</button>
          <div className="w-12 text-center font-medium">{quantity}</div>
          <button onClick={increaseQty} className="w-8 h-12 flex justify-center items-center text-xl font-bold text-black cursor-pointer">+</button>
        </div>
      </div>

      {/* Share + Add to Cart */}
      <div className="flex items-center gap-3 mt-4">
        {/* Share button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: document.title,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Product link copied to clipboard!');
            }
          }}
          className="p-3 bg-rose-500/10 text-rose-500/70 rounded-md"
          title="Share"
        >
          <img src="/app/assets/Icons/humbleicons_share.png" alt="" />
        </button>

        {/* Add to Cart button */}
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [{merchandiseId: selectedVariant.id, quantity, selectedVariant}]
              : []
          }
          className="flex items-center cursor-pointer add-to-cart-button justify-center gap-2 bg-rose-500/70 text-white font-semibold py-3 rounded-md w-full uppercase"
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
