import {Suspense} from 'react';
import {Await, Link, NavLink} from '@remix-run/react';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <div className='mt-[50px]'>

      {/* Main */}
      <div className='flex justify-between pt-[60px] pb-[30px] px-[16px] bg-[#f5f5f5]'>
        {/* Nav Column 1 */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[16px] font-bold mb-0.5'>
            For You
          </h2>

          <Link to="/">
            Favorites
          </Link>

          <Link to="/">
            Gift Cards
          </Link>

          <Link to="/">
            Afterpay
          </Link>

          <Link to="/">
            Tillys Rewards
          </Link>

          <Link to="/">
            Student Discount
          </Link>

          <Link to="/">
            Blog
          </Link>
        </div>

        {/* Nav Column 2 */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[16px] font-bold mb-0.5'>
            Guest Services
          </h2>

          <Link to="/">
            Order Status
          </Link>

          <Link to="/">
            Returns & Exchanges
          </Link>

          <Link to="/">
            Billing
          </Link>

          <Link to="/">
            Shipping
          </Link>

          <Link to="/">
            Same Day Delivery
          </Link>
        </div>

        {/* Nav Column 3 */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[16px] font-bold mb-0.5'>
            Company
          </h2>

          <Link to="/">
            About Us
          </Link>

          <Link to="/">
            Careers
          </Link>

          <Link to="/">
            Investor Relations
          </Link>

          <Link to="/">
            We Care
          </Link>

          <Link to="/">
            Tilly's Life Center
          </Link>

          <Link to="/">
            Affiliate
          </Link>

          <Link to="/">
            Trending Searches
          </Link>

          <Link to="/">
            Trending Products
          </Link>
        </div>

        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[16px] font-bold'>
            Find a Store
          </h2>
        </div>

        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[16px] font-bold'>
            Connect with Us
          </h2>
        </div>
      </div>

      {/* Bottom */}
      <div className='flex flex-col items-center justify-center gap-[16px] bg-black text-white pt-[28px] pb-[16px] px-[16px]'>
        <nav className='flex items-center gap-[14px]'>
          <Link 
            className='text-[13px] text-white'
            to="/"
          >
            Terms of Use
          </Link>

          <Link
            className='text-[13px] text-white'
            to="/"
          >
            Privacy Policy
          </Link>

          <Link 
            className='text-[13px] text-white'
            to="/"
          >
            Cookie Policy
          </Link>
        </nav>

        <p className='text-[13px]'>
          &copy; 2025 Tillys All Rights Reserved
        </p>
      </div>
    </div>
    
    // <Suspense>
    //   <Await resolve={footerPromise}>
    //     {(footer) => (
    //       <footer className="footer">
    //         {footer?.menu && header.shop.primaryDomain?.url && (
    //           <FooterMenu
    //             menu={footer.menu}
    //             primaryDomainUrl={header.shop.primaryDomain.url}
    //             publicStoreDomain={publicStoreDomain}
    //           />
    //         )}
    //       </footer>
    //     )}
    //   </Await>
    // </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
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

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
