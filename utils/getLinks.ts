import axios from 'axios';
import { LinkObject, getLinkObjects } from './parseHTML';

function filterLinks(links: LinkObject[]): LinkObject[] {
  // Filter out unwanted links
  links = links.filter(link => {
    return (
      link.text.length > 30 &&
      link.text.length < 250 &&
      !link.text.includes('<img') &&
      !link.text.includes('Paid Program') &&
      !link.href.includes('#') &&
      !link.href.includes('sponsored')
    );
  });

  // Filter out duplicate links
  links = links.filter((link, index, array) => {
    return array.findIndex(l => l.href === link.href) === index;
  });

  return links;
};

function addBaseUrlIfNeeded(link: LinkObject, url: string): LinkObject {
  if (link.href.includes('/') && !link.href.includes('http')) {
    link.href = `${url}${link.href}`;
  };

  return link;
};

function formatLinks(links: LinkObject[], url: string): LinkObject[] {
  return links.map(link => {
    addBaseUrlIfNeeded(link, url);

    // Remove \n
    link.text = link.text.replace(/\n/g, '');

    // Remove '...'
    link.text = link.text.replace(/\.\.\./g, '');

    // Replace excess whitespace with single space
    link.text = link.text.replace(/\s\s+/g, ' ');

    return link;
  });
};

export async function getLinks(
  url: string,
  numLinks: number = 10
) {
  try {
    let links: LinkObject[] = [];

    const response = await axios.get(url);
    const html: string = response.data.toString();

    links = getLinkObjects(html);

    links = filterLinks(links);

    links = formatLinks(links, url);

    return links.slice(0, numLinks);;
  } catch (error) {
    console.error(error);
  };
};
