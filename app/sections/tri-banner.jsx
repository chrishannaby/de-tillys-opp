import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';
import {Link} from '@remix-run/react';

const TRI_BANNER_QUERY = `
  query GetTriBanner($identifier: String!) {
    triBanner(id: $identifier) {
      showSection
      image1 {
        url
        description
        width
        height
      }
      title1
      ctaLabel1
      ctaLink1
      image2 {
        url
        description
        width
        height
      }
      title2
      ctaLabel2
      ctaLink2
      image3 {
        url
        description
        width
        height
      }
      title3
      ctaLabel3
      ctaLink3
      sys {
        id
      }
    }
  }
`;

export function TriBanner({identifier}) {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(TRI_BANNER_QUERY, {
        identifier: identifier
      });
      setBannerData(data?.triBanner);
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

  return (
    <section className="flex gap-[16px] container mx-auto pt-[35px] pb-[25px]">
      {/* Image 1 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <div className="relative w-full h-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px] z-10">
            <h2 className="text-white uppercase text-[24px] font-bold whitespace-nowrap">
              {bannerData.title1}
            </h2>

            <div className="flex items-center gap-[16px]">
              <Link
                to={bannerData.ctaLink1}
                className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
              >
                {bannerData.ctaLabel1}
              </Link>
            </div>
          </div>

          <img
            src={bannerData.image1.url}
            alt={bannerData.image1.description || ''}
            width={bannerData.image1.width}
            height={bannerData.image1.height}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 2 */}
      <div className="flex-[1] w-[650px] h-[800px]">
        <div className="relative w-full h-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px] z-10">
            <h2 className="text-white uppercase text-[24px] font-bold text-center whitespace-nowrap">
              {bannerData.title2}
            </h2>

            <Link
              to={bannerData.ctaLink2}
              className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
            >
              {bannerData.ctaLabel2}
            </Link>
          </div>

          <img
            src={bannerData.image2.url}
            alt={bannerData.image2.description || ''}
            width={bannerData.image2.width}
            height={bannerData.image2.height}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 3 */}
      <div className="flex-[1] w-[33%] h-[800px]">
        <div className="relative w-full h-full">
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[22px] z-10">
            <h2 className="text-white uppercase text-[24px] font-bold text-center">
              {bannerData.title3}
            </h2>

            <Link
              to={bannerData.ctaLink3}
              className="bg-white text-black py-[10px] px-[25px] rounded-[25px] text-[14px] font-[400] w-fit text-center whitespace-nowrap"
            >
              {bannerData.ctaLabel3}
            </Link>
          </div>

          <img
            src={bannerData.image3.url}
            alt={bannerData.image3.description || ''}
            width={bannerData.image3.width}
            height={bannerData.image3.height}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}