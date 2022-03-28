// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLinks, LinkObject } from '../../../utils/getLinks';
import { getTopLinks } from '../../../utils/getTopLinks';
import { routes } from '../../../data/routes';

export type Data = {
  links?: LinkObject[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { slug } = req.query;
  let links: LinkObject[] = [];

  // /articles/top
  if (req.method === 'GET' && slug.includes('top')) {
    const result = await getTopLinks();
    if (result) links = [...result];
  };

  // /articles/[slug]
  if (
    req.method === 'GET' &&
    !slug.includes('top') &&
    typeof slug === 'string'
  ) {

    // Get url from routes object array
    const url = routes.find(link => link.path === slug)?.url;

    if (url) {
      const result = await getLinks(url);
      if (result) links = [...result];
    }
  };

  if (links) res.status(200).json({ links });
  else res.status(500).json({ error: 'Failed to fetch links' });
};
