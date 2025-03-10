import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';
import {Link} from '@remix-run/react';

const IMAGE_BANNER_QUERY = `
  query GetImageBanner($identifier: String!) {
    imageBanner(id: $identifier) {
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

export function ImageBanner({identifier}) {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(IMAGE_BANNER_QUERY, {
        identifier: identifier
      });
      console.log('Image Banner Response:', data);
      setBannerData(data?.imageBanner);
      setLoading(false);
    }

    fetchContent();
  }, [identifier]);

  if (loading || !bannerData) {
    return null;
  }

  // Early return if section should not be shown
  if (!bannerData.showSection) {
    return null;
  }

  const {image, ctaLabel, ctaLink} = bannerData;

  return (
    <div className="container mx-auto py-[16px]">
      <div className="relative">
        <img
          src={image.url}
          alt={image.description || ''}
          width={image.width}
          height={image.height}
          className="w-full"
        />

        {ctaLabel && ctaLink && (
          <Link
            to={ctaLink}
            className="absolute bottom-[32px] left-1/2 -translate-x-1/2 text-center text-[14px] font-[400] bg-white text-black py-[10px] px-[25px] rounded-[25px]"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}