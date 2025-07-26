import {Suspense} from 'react';
import {Await, Form, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react';

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-black text-white flex flex-wrap justify-center text-sm">
            {/* Newsletter Signup Section */}

            <div className="container max-w-7xl px-4 py-10">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-11">
                <div className="md:w-1/2">
                  <h2 className="font-bold text-lg mb-2">Join with us</h2>
                  <p className="text-white/80">
                    Sign up for Weekly Newsletters to receive information about
                    new arrivals, future events and special discounts.
                  </p>
                </div>
                <Form method="post" className="flex w-full md:w-1/2 gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/50  text-white placeholder:text-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 uppercase bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition"
                  >
                    Subscribe
                  </button>
                </Form>
              </div>
            </div>

            {/* Footer Main Section */}
            <div className="container max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
              {/* logo and Social */}
              <div className="space-y-6">
                <img
                  src="/app/assets/logo/logo.png"
                  alt="Logo"
                  className="w-[150px] h-auto filter invert brightness-0"
                />
                <p>Chicly is a women’s wear brand born in Kolkata, empowering Indian women with stylish, comfortable fashion since 2022. Crafted with care, rooted in simplicity, and inspired by sustainability.</p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="hover:text-gray-200"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="hover:text-gray-200"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="hover:text-gray-200"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>

              {/* Dynamic Menus */}
              <div className="space-y-6">
                <h4 className='font-semibold text-lg mb-4'>
                  SHOP
                </h4>
                <ul className='space-y-3 font-source text-sm'>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      Products
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      New Arrival
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      Tops & Tunics
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                     Dresses
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      Products
                    </NavLink>
                  
                  </li>

                </ul>
              </div>
              <div className="space-y-6">
                <h4 className='font-semibold text-lg mb-4'>
                  OUR POLICYS
                </h4>
                <ul className='space-y-3 font-source text-sm'>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                     Privacy Policy
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      Terms and Conditions
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                      Return and Refund
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                     Contact Us
                    </NavLink>
                  
                  </li>
                  <li>
                    <NavLink 
                    to='/collection/all'
                    className='text-white hover:text-red-300 transition-colors'>
                     About Us
                    </NavLink>
                  
                  </li>

                </ul>
              </div>
              
              {/* Help & Contact Info */}
              <div className="md:col-span-1">
                <h3 className="font-semibold text-lg mb-4">Here to help</h3>
                <p className="mb-2 flex items-start gap-2">
                  <HelpCircle size={18} />
                  <span>
                    Have a question? You may find an answer in our FAQs.
                  </span>
                </p>
                <p className="mb-2 flex items-start gap-2">
                  <Phone size={18} />
                  <span>
                    Call Us: +91 7003709943
                    <br />
                    Mon-Sat: 9:00 am - 7:00 pm
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail size={18} />
                  <a href="mailto:support@yourdomain.com" className="underline">
                    Send us an email
                  </a>
                </p>
              </div>
            </div>
            <div className="divider border-b w-full border-white/50"></div>

            {/* Social + Copyright */}
            <div className="border- w-full py-6 border-b-transparent pt-6 px-4  max-w-7xl">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <div className="text-white/70">© Chickly {currentYear}</div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
