const CONTENTFUL_SPACE_ID = 'muq3cmfs2ysm';
const CONTENTFUL_ACCESS_TOKEN = 'PfN6VBEvPcWW2hoXDh3Yp2QZtCPhwtkFYLfAfUFgbw8';

const CONTENTFUL_GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;

export async function getContentfulData(query, variables = {}) {
  try {
    const response = await fetch(CONTENTFUL_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Contentful fetch error:', error);
    return null;
  }
}