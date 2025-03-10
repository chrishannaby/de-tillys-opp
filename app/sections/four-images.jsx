import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';
import {Link} from '@remix-run/react';

const FOUR_IMAGES_QUERY = `
  query GetFourImages($identifier: String!) {
    fourImages(id: $identifier) {
      showSection
      sectionTitle
      image1 {
        url
        description
        width
        height
      }
      link1
      image2 {
        url
        description
        width
        height
      }
      link2
      image3 {
        url
        description
        width
        height
      }
      link3
      image4 {
        url
        description
        width
        height
      }
      link4
      sys {
        id
      }
    }
  }
`;

export function FourImages({identifier}) {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(FOUR_IMAGES_QUERY, {
        identifier: identifier
      });
      setSectionData(data?.fourImages);
      setLoading(false);
    }

    fetchContent();
  }, [identifier]);

  if (loading || !sectionData) {
    return null;
  }

  if (!sectionData.showSection) {
    return null;
  }

  const images = [
    { image: sectionData.image1, link: sectionData.link1 },
    { image: sectionData.image2, link: sectionData.link2 },
    { image: sectionData.image3, link: sectionData.link3 },
    { image: sectionData.image4, link: sectionData.link4 },
  ];

  return (
    <div className="container mx-auto mt-[32px] mb-[45px]">
      <h2 className="text-[18px] font-[600] pb-[8px] mb-[35px] border-b border-black">
        {sectionData.sectionTitle}
      </h2>

      <div className="grid grid-cols-4 gap-[25px]">
        {images.map((item, i) => (
          <Link 
            key={i}
            to={item.link}
            className="block w-full h-full aspect-[2/3]"
          >
            <img
              src={item.image.url}
              alt={item.image.description || ''}
              width={item.image.width}
              height={item.image.height}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}