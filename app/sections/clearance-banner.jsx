import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';
import {Link} from '@remix-run/react';

const CLEARANCE_BANNER_QUERY = `
  query GetClearanceBanner($identifier: String!) {
    clearanceBanner(id: $identifier) {
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

export function ClearanceBanner({identifier}) {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(CLEARANCE_BANNER_QUERY, {
        identifier: identifier
      });
      setBannerData(data?.clearanceBanner);
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
    <div className="container mx-auto relative w-full h-[90px] mb-[16px]">
      <img
        src={image.url}
        alt={image.description || ''}
        width={image.width}
        height={image.height}
        className="w-full h-full object-cover"
      />

      <Link 
        to={ctaLink}
        className="absolute top-1/2 right-[52px] -translate-y-1/2 text-center text-[14px] font-[400] bg-white text-black py-[10px] px-[25px] rounded-[25px]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}