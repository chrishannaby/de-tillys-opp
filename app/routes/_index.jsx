import {useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {PromoBanner} from '~/sections/promo-banner';
import {TriBanner} from '~/sections/tri-banner';
import {ImageBanner} from '~/sections/image-banner';

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
      <TriBanner />
      <ImageBanner />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
