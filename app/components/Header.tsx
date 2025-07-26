import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setLastScrolly] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();
  return (
    <div
      className={`w-full z-40 transition-transform duration-500 ease-in-out 
      ${
        !isScrollingUp && isScrolled && asideType === 'closed'
          ? '-translate-y-full'
          : '-translate-y-0'
      }
    `}
    >
      {/* Announcement Bar  */}
      <div
        className={` overflow-hidden transition-all duration-500 ease-in-out text-white ${isScrolled} `}
        style={{backgroundColor: '#c8202f'}}
      >
        <div className="container mx-auto text-center py-2.5 px-4">
          <p
            className="text-[13px] leading-tight sm:text-sm font-light tracking-wider uppercase"
            style={{fontFamily: 'Filson Pro, sans-serif'}}
          >
            20% OFF For Pre Paid Order.
          </p>
        </div>
      </div>

      {/* main-header  */}
      <header
        className={`transition-all duration-500 ease-in-out border-b sticky top-0 z-50 ${
          isScrolled
            ? 'bg-white backdrop-blur-lg shadow-sm border-transparent'
            : 'bg-white border-gray-100'
        }`}
      >
        {/* Mobile Logo (550px and below) */}
        <div className={`hidden max-[550px]:flex items-center justify-between px-4 border-b border-gray-100 transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'}`}>
  
  {/* Left: Hamburger */}
  <HeaderMenuMobileToggle />

  {/* Center: Logo */}
  <NavLink prefetch="intent" to="/" className="text-2xl tracking-normal">
    <img src="/app/assets/logo.png" alt="Logo" className="inline-block w-[100px] h-auto" />
  </NavLink>

  {/* Right: CTAs */}
  <div className="flex items-center gap-3">
    <NavLink prefetch="intent" to="/account">
      <User className="w-6 h-6" />
    </NavLink>

    <CartToggle cart={cart} />
  </div>
</div>

        <div
          className={`max-[550px]:hidden header-main flex justify-between text-center border-b border-gray-100 transition-all duration-300 ease-in-out ${
            isScrolled ? 'py-1' : 'py-2'
          }`}
        >
          {/* Logo (above 550px) */}
          <NavLink
            prefetch="intent"
            to="/"
            className={`tracking-wider text-center max-[550px]:hidden absolute left-0.5 translate-0.5 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out ${
              isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text[28px]'
            }`}
          >
            <img src="/app/assets/logo.png" alt="Logo" className="inline-block w-[150px] h-auto ml-2" />
          </NavLink>
          {/* desktop navigation  */}
          <div className="hidden lg:flex flex-1-px-12 ">
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
          {/* CTAS  */}
            <div className='flex items-center'>
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart}/>
            </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

const baseClassName = "relative no-underline transition-all duration-200 hover:text-brand-gold font-source after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full";


  const desktopClassName =
    'flex items-center justify-center gap-12 text-sm uppercase ';
  const mobileClassName = 'flex flex-col px-6';
  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && 
      <>
      {/* mobile navigation links */}
     <div className="space-y-6 py-4">
       {(menu?.items || []).map((item) => {
            if (!item.url) return null;

            let url = item.url;
            try {
              const isInternalUrl =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl);

              if (isInternalUrl) {
                url = new URL(item.url).pathname;
              }
            } catch (error) {
              console.error('URL parse error:', item.url, error);
            }

            return (
              <NavLink
                key={item.id}
                to={url}
                prefetch="intent"
                onClick={close}
                className={({isActive}) =>
                  `
      ${baseClassName} py-2 block text-lg hover:text-red-600 transition-colors
      ${isActive ? '!text-red-600 after:w-full' : 'text-black '}
    `
                }
              >
                {item.title}
              </NavLink>
            );
          })}
     </div>
     {/* mobile footer links */}
     <div className="mt-auto border-t border-gray-100 py-6">
          <div className="space-y-4">
            <NavLink 
            to='/account'
            className='flex items-center space-x-2 text-black hover:bg-red-600'
            >
              <User className='w-5 h-5'/>
              <span className=' font-source text-base'>Account</span>
            </NavLink>
            <button className='flex space-x-2'
            onClick={() => {
              close();
              // todo search logic 
            }}>
              <Search className='w-5 h-5 cursor-pointer' />
              <span className=' font-source text-base'>Search</span>
            </button>
          </div>
     </div>
      </>
      }

      {viewport === 'desktop' && (
        <>
          {(menu?.items || []).map((item) => {
            if (!item.url) return null;

            let url = item.url;
            try {
              const isInternalUrl =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl);

              if (isInternalUrl) {
                url = new URL(item.url).pathname;
              }
            } catch (error) {
              console.error('URL parse error:', item.url, error);
            }

            return (
              <NavLink
                key={item.id}
                to={url}
                prefetch="intent"
                onClick={close}
                className={({isActive}) =>
                  `
      ${baseClassName} hover:!text-red-600
      ${isActive ? '!text-red-600 font-medium font-filson after:w-full' : 'text-black font-filson font-medium'}
    `
                }
              >
                {item.title}
              </NavLink>
            );
          })}
        </>
      )}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center !gap-[20px] w-[150px] justify-center role='navigation">
      <SearchToggle />
      <NavLink
      prefetch='intent'
      to='/account'
       className='p-2 hover:text-red-600 transition-colors duration-200 relative 
             after:content-[""] after:absolute after:bottom-0 after:left-1/2 
             after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-red-600 
             after:transition-all after:duration-300 hover:after:w-full'
      >
        <span className='sr-only'>
          Account
        </span>
        <User className='w-6 h-6 hover:text-red-600 transition-colors'></User>
      </NavLink>
      <div className="pl-0 sm:pl-2">
        <CartToggle cart={cart} />
      </div>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2 hover:text-amber-300 transition-colors duration-200"
      onClick={() => open('mobile')}
    >
      {/* to show hamburger in mobile view  */}
      {/* npm i lucide-react
      then improt menu form lucide-react which is above imported  */}
      <Menu />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
     className='p-2 cursor-pointer hover:text-red-600 transition-colors duration-200 relative 
             after:content-[""] after:absolute after:bottom-0 after:left-1/2 
             after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-red-600 
             after:transition-all after:duration-300 hover:after:w-full'
    onClick={()=> open("search")}
    >
      <Search className='w-6 h-6'/>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    

    <button
      className='p-2 cursor-pointer hover:text-red-600 transition-colors duration-200 relative 
             after:content-[""] after:absolute after:bottom-0 after:left-1/2 
             after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-red-600 
             after:transition-all after:duration-300 hover:after:w-full'
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingBag className='w-5 h-5' />
      {count !== null && count > 0 && (
        <span className='absolute top-1 right-1 bg-red-600 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center'>{ count > 9 ? '9+' :count }</span>)}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}


