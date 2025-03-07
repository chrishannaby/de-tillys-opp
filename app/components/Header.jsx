import {Suspense, useId} from 'react';
import {Await, Link, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';

import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useAside} from '~/components/Aside';
import logo from '~/assets/tillys-logo.svg';
import discoverYourStyle from '~/assets/discover-your-style.webp';
import bagIcon from '~/assets/bag-icon.svg';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const {close} = useAside();
  const queriesDatalistId = useId();

  return (
    <>
      <div>
        {/* Top Black Bar */}
        <div className='bg-black w-full h-[42px]'></div>

        {/* Announcement Bar */}
        <div className='flex items-center justify-between px-[16px] py-[5px]'>
          <p className='text-[12px]'>
            FREE SHIPPING on orders over $59* <span className='underline'>details</span>
          </p>

          <div className='flex items-center gap-4 text-[12px]'>
            <Link to="/account">
              Sign In
            </Link>

            <Link to="/rewards">
              Join Rewards
            </Link>

            <Link to="/orders/track">
              Track Order
            </Link>

            <Link to="/stores/northshore-mall">
              Your Store: Northshore Mall
            </Link>
          </div>
        </div>
      </div>
      
      <header className="sticky top-0 z-1 bg-white">
        <style jsx>{`
          header::after {
            content: '';
            position: absolute;
            left: 0;
            top: 100%;
            height: 8px;
            width: 100%;
            background: linear-gradient(rgba(0, 0, 0, 0.1), transparent);
          }
        `}
        </style>

        {/* Main */}
        <div className='grid grid-cols-3 items-center justify-items-center px-[16px] py-[5px]'>
          <Link 
            to="/"
            className='mr-auto'
          >
            <h1>
              <img 
                className='w-[205px] h-[52px]'
                src={logo} 
                alt="Tillys Logo" 
              />
            </h1>
          </Link>

          <Link 
            to="/"
            className='w-[200px] h-auto'
          >
            <img 
              className='w-full h-full'
              src={discoverYourStyle} 
              alt="Discover Your Style" 
            />
          </Link>

          <div className='flex items-center justify-end gap-[15px] w-full'>
            <SearchFormPredictive className='relative w-fit h-[40px]'>
              {({fetchResults, goToSearch, inputRef}) => (
                <>
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search"
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                    className='py-[10px] px-[40px] bg-[#f5f5f5] border-none outline-none rounded-[800px] overflow-hidden placeholder:text-[#757575]'
                  />

                  &nbsp;
                  <button 
                    onClick={goToSearch}
                    className='absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center justify-center'
                  >
                    <svg className='h-[18px] w-[18px]' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#757575">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                </>
              )}
            </SearchFormPredictive>

            <Suspense fallback={<CartBadge count={null} />}>
              <Await resolve={cart}>
                <CartBanner />
              </Await>
            </Suspense>
          </div>
        </div>

        <nav 
          className='flex items-center gap-4 pr-[16px] border-t border-[#C4BFC1]'
          role="navigation"
        >
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <NavLink
                className="header-menu-item px-[16px] py-[10px] text-[14px]"
                end
                key={item.id}
                onClick={close}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}

          <SearchToggle />
        </nav>
        
        {/* <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <strong>{shop.name}</strong>
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
      </header>
    </>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
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

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      // onClick={(e) => {
      //   e.preventDefault();
      //   open('cart');
      // }}
      className='relative flex items-center justify-center w-[28px] h-[28px]'
    >
      <img 
        src={bagIcon}
        alt="Cart Icon"
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px]'
      />

      <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[4px] text-[12px] font-[400]'>
        {count === null ? '0' : count}
      </span>
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
