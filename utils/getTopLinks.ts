import { LinkObject } from "./parseHTML";

import { getLinks } from "./getLinks";

import { routes } from "../data/routes";

export async function getTopLinks() {
  const allLinks: LinkObject[] = [];

  for (let route of routes) {
    if (route.url) { // Skips the 'top' route
      const links = await getLinks(route.url, 3);
      if (links) allLinks.push(...links);
    };
  };

  // Randomize the order of the links
  return allLinks.sort(() => 0.5 - Math.random());;
};
