import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';
import {Link} from '@remix-run/react';

const PROMO_BANNER_QUERY = `
  query GetPromoBanner($identifier: String!) {
    promoBanner(id: $identifier) {
      showSection
      image {
        url
        description
        width
        height
      }
      ctaLabel
      ctaLink
      sys {
        id
      }
    }
  }
`;

export function PromoBanner({identifier}) {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(PROMO_BANNER_QUERY, {
        identifier: identifier
      });
      setBannerData(data?.promoBanner);
      setLoading(false);
    }

    fetchContent();
  }, [identifier]);

  if (loading || !bannerData) {
    return null;
  }

  if (!bannerData.showSection) {
    return null;
  }

  const {image, ctaLabel, ctaLink} = bannerData;

  return (
    <section className="relative container mx-auto py-[24px] h-full">
      <div className="h-[186px] w-full">
        <img
          src={image.url}
          alt={image.description || ''}
          width={image.width}
          height={image.height}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-1/2 right-[105px] -translate-y-1/2">
        <Link 
          to={ctaLink}
          className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}