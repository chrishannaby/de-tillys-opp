import {useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {PromoBanner} from '~/sections/promo-banner';
import {TriBanner} from '~/sections/tri-banner';
import {ImageBanner} from '~/sections/image-banner';

import {FourImages} from '~/sections/four-images';
import {ClearanceBanner} from '~/sections/clearance-banner';

import {MetaText} from '~/sections/meta-text';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: "Tillys | Men, Women and Kids' Clothing & Shoe Store | Home"}];
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

      <ImageBanner identifier="3xmCzSsHmKanmwC2lGdts8" />
      <ImageBanner identifier="5u2Y4g19U5hcB0d3eoQWqs" />
      <ImageBanner identifier="22bePoyqoT3ltUA6PYYJNn" />

      {/* Dual Banner with Text Below */}

      {/* Tri Banner Logo Below */}

      {/* Media with Text - Right + Image */}

      <FourImages title="Shop Accessories" />
      <FourImages title="Shop by Category" />

      <ClearanceBanner />

      <MetaText identifier="3d7pZrSMyMzRfQfxFmUAKa" />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
