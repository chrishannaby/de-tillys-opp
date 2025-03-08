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

          <div className='flex gap-[20px] items-center'>
            <a 
              href="https://www.facebook.com/Tillys"
              className='w-[32px] h-[32px] rounded-full overflow-hidden bg-black flex items-center justify-center'
            >
              <svg 
                width="20"
                height="20"
                viewBox="0 0 512 512"
                style={{
                  fillRule: 'evenodd',
                  clipRule: 'evenodd',
                  strokeLinejoin: 'round',
                  strokeMiterlimit: 2
                }}
              >
                <path 
                  d="M374.245,285.825l14.104,-91.961l-88.233,0l0,-59.677c0,-25.159 12.325,-49.682 51.845,-49.682l40.117,0l0,-78.291c0,0 -36.408,-6.214 -71.214,-6.214c-72.67,0 -120.165,44.042 -120.165,123.775l0,70.089l-80.777,0l0,91.961l80.777,0l0,222.31c16.197,2.542 32.798,3.865 49.709,3.865c16.911,0 33.512,-1.323 49.708,-3.865l0,-222.31l74.129,0Z"
                  style={{
                    fill: 'white',
                    fillRule: 'nonzero'
                  }}
                />
              </svg>
            </a>

            <a
              href="https://instagram.com/tillys/"
              className='w-[32px] h-[32px] rounded-full overflow-hidden bg-black flex items-center justify-center'
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="white"/></g></svg>
            </a>
                    
            <a 
              href="https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.tillys.com%2Fproduct%2Ffull-tilt-queen-of-thorns-womens-baby-tee%2F515924150.html&amp;description=FULL%20TILT%20Queen%20of%20Thorns%20Womens%20Baby%20Tee&amp;media=https%3A%2F%2Fwww.tillys.com%2Fon%2Fdemandware.static%2F-%2FSites-master-catalog%2Fdefault%2Fdw248bdbad%2Ftillys%2Fimages%2Fcatalog%2F1000x1000%2F515924150.jpg"
              className='w-[32px] h-[32px] rounded-full overflow-hidden bg-black flex items-center justify-center'
            >
              <svg width="20" height="20" viewBox="0 0 512 512"><path fill="white" d="M255.998,0.001c-141.384,0 -255.998,114.617 -255.998,255.998c0,108.456 67.475,201.171 162.707,238.471c-2.24,-20.255 -4.261,-51.405 0.889,-73.518c4.65,-19.978 30.018,-127.248 30.018,-127.248c0,0 -7.659,-15.334 -7.659,-38.008c0,-35.596 20.632,-62.171 46.323,-62.171c21.839,0 32.391,16.399 32.391,36.061c0,21.966 -13.984,54.803 -21.203,85.235c-6.03,25.482 12.779,46.261 37.909,46.261c45.503,0 80.477,-47.976 80.477,-117.229c0,-61.293 -44.045,-104.149 -106.932,-104.149c-72.841,0 -115.597,54.634 -115.597,111.095c0,22.004 8.475,45.596 19.052,58.421c2.09,2.535 2.398,4.758 1.776,7.343c-1.945,8.087 -6.262,25.474 -7.111,29.032c-1.117,4.686 -3.711,5.681 -8.561,3.424c-31.974,-14.884 -51.963,-61.627 -51.963,-99.174c0,-80.755 58.672,-154.915 169.148,-154.915c88.806,0 157.821,63.279 157.821,147.85c0,88.229 -55.629,159.232 -132.842,159.232c-25.94,0 -50.328,-13.476 -58.674,-29.394c0,0 -12.838,48.878 -15.95,60.856c-5.782,22.237 -21.382,50.109 -31.818,67.11c23.955,7.417 49.409,11.416 75.797,11.416c141.389,0 256.003,-114.612 256.003,-256.001c0,-141.381 -114.614,-255.998 -256.003,-255.998Z"/></svg>
            </a>

            <a
              href="https://instagram.com/tillys/"
              className='w-[32px] h-[32px] rounded-full overflow-hidden bg-black flex items-center justify-center'
            >
              <svg width="20" height="20" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
            </a>

            <a
              href="https://www.youtube.com/user/tillys"
              className='w-[32px] h-[32px] rounded-full overflow-hidden bg-black flex items-center justify-center'
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 512 512" 
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{
                  enableBackground: 'new 0 0 512 512'
                }}
              >
                <g id="_x33_95-youtube">
                  <g>
                    <path 
                      d="M476.387,144.888c-5.291-19.919-20.878-35.608-40.67-40.933C399.845,94.282,256,94.282,256,94.282    s-143.845,0-179.719,9.674c-19.791,5.325-35.378,21.013-40.668,40.933c-9.612,36.105-9.612,111.438-9.612,111.438    s0,75.334,9.612,111.438c5.29,19.92,20.877,34.955,40.668,40.281C112.155,417.719,256,417.719,256,417.719    s143.845,0,179.717-9.674c19.792-5.326,35.379-20.361,40.67-40.281c9.612-36.104,9.612-111.438,9.612-111.438    S485.999,180.994,476.387,144.888z"
                      style={{
                        fill: '#FFFFFF'
                      }}
                    />
                    <polygon 
                      points="208.954,324.723 208.954,187.93 329.18,256.328"
                      style={{
                        fill: '#000000'
                      }}
                    />
                  </g>
                </g>
                <g id="Layer_1"/>
              </svg>
            </a>
          </div>

          <div>
            Download App
          </div>
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
