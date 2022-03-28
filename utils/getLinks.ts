import axios from 'axios';
import * as cheerio from 'cheerio';

export const getLinks = async (url: string, numLinks?: number) => {
  try {
    let links: LinkObject[] = [];

    const response = await axios.get(url);
    const html = response.data.toString();

    let $ = cheerio.load(html);

    let linkObjects = $('a'); // get all hyperlinks

    linkObjects.each((index, element) => {
      links.push({
        text: $(element).text().trim(), // get the text and trim white space
        href: $(element).attr('href'), // get the href attribute
      });
    });

    // Filter out unwanted links
    links = links.filter(link => {
      return (
        link.text.length > 30 &&
        !link.text.includes('<img') &&
        !link.text.includes('Paid Program') &&
        !link.href?.includes('sponsored')
      );
    });

    // If the link is a relative path, add the base url to the link
    links = links.map(link => {
      if (link.href?.includes('/') && !link.href?.includes('http')) {
        link.href = `${url}${link.href}`;
      }
      return link;
    });

    // Filter out duplicate links
    links = links.filter((link, index, array) => {
      return array.findIndex(l => l.href === link.href) === index;
    });

    links = links.map(link => {
      // get rid of \n
      link.text = link.text.replace(/\n/g, '');

      // replace '...' with ''
      link.text = link.text.replace(/\.\.\./g, '');

      // get rid of excess whitespace
      link.text = link.text.replace(/\s\s+/g, ' ');

      return link;
    });

    // If numLinks is specified, return the first numLinks links
    if (numLinks) {
      links = links.slice(0, numLinks);
    };

    // If there are more than 10 links in the array, remove the rest
    if (links.length > 10) {
      links = links.slice(0, 10);
    }

    return links;
  } catch (error) {
    console.error(error);
  };
};

export interface LinkObject {
  text: string,
  href: string | undefined,
};
