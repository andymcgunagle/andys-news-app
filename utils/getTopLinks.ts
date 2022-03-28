import { routes } from "../data/routes";
import { getLinks, LinkObject } from "./getLinks";

export async function getTopLinks() {
  const allLinks: LinkObject[] = [];

  for (let route of routes) {
    if (route.url) {
      const links = await getLinks(route.url, 3);
      if (links) allLinks.push(...links);
    };
  };

  // Randomize the order of the links
  return allLinks.sort(() => 0.5 - Math.random());;
};