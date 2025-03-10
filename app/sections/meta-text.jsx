import {useState, useEffect} from 'react';
import {getContentfulData} from '~/lib/contentful';

const META_TEXT_QUERY = `
  query GetMetaText($identifier: String!) {
    metaText(id: $identifier) {
      showSection
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
  const [showSection, setShowSection] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const data = await getContentfulData(META_TEXT_QUERY, {
        identifier: identifier
      });

      // Access the text content from the rich text field
      setText(data?.metaText?.text?.json?.content?.[0]?.content?.[0]?.value || null);
      setShowSection(data?.metaText?.showSection ?? true);
      setLoading(false);
    }

    fetchContent();
  }, [identifier]);

  if (loading || !text) {
    return <div className="container mx-auto pt-[50px] pb-[16px]" />;
  }

  if (!showSection) {
    return null;
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