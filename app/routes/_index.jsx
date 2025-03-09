import {useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {PromoBanner} from '~/sections/promo-banner';
import {TriBanner} from '~/sections/tri-banner';
import {ImageBanner} from '~/sections/image-banner';

import {FourImages} from '~/sections/four-images';
import {ClearanceBanner} from '~/sections/clearance-banner';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context}) {
  return null;
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div className="home">
      <PromoBanner />

      {/* Media with Text - Left + Video */}

      <TriBanner />
      <ImageBanner />

      {/* Image Banner with Logo + 2 Buttons */}
      {/* Image Banner with Logo + 2 Buttons Horizontal */}
      {/* Dual Banner with Text Below */}

      {/* Tri Banner Logo Below */}

      {/* Media with Text - Right + Image */}

      <FourImages title="Shop Accessories" />
      <FourImages title="Shop by Category" />

      <ClearanceBanner />

      {/* Bottom Text */}
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
