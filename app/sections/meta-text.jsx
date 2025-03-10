import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';

const META_TEXT_QUERY = `
  query GetMetaText($identifier: String!) {
    metaText(id: $identifier) {
      text {
        json
      }
      sys {
        id
      }
    }
  }
`;

export function MetaText({identifier}) {
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      console.log('Fetching with ID:', identifier);
      const data = await getContentfulData(META_TEXT_QUERY, {
        identifier: identifier
      });
      console.log('Contentful Raw Response:', data);

      // Access the text content from the rich text field
      setText(data?.metaText?.text?.json?.content?.[0]?.content?.[0]?.value || null);
      setLoading(false);
    }

    fetchContent();
  }, [identifier]);

  if (loading || !text) {
    return <div className="container mx-auto pt-[50px] pb-[16px]" />;
  }

  return (
    <div className="container mx-auto pt-[50px] pb-[16px]">
      <div 
        className="text-[12px] text-center"
        dangerouslySetInnerHTML={{
          __html: text
        }}
      />
    </div>
  );
}