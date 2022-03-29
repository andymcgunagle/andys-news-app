function getContentsBetweenAllAnchorTags(html: string): string[] {
  return html
    .split('<a ')
    .map(link => {
      return link
        .split('</a>')[0]
        .split('href="')[1];
    })
    .filter(link => link && link);
};

function getHref(anchorTagContents: string): string {
  return anchorTagContents.slice(0, anchorTagContents.indexOf('"'));
};

function cleanText(text: string) {
  return text.trim().replace('&amp', '&');
};

function getText(anchorTagContents: string): string {
  const text = anchorTagContents
    .slice(anchorTagContents.indexOf('"'))
    .split('><')
    .map(text => text.split('>')[1])
    .filter(text => text && text)
    .map(text => text.split('<')[0])[0];

  return text ? cleanText(text) : 'NO VALUE';
};

function createLinkObjects(contentsBetweenAllAnchorTags: string[]): LinkObject[] {
  return contentsBetweenAllAnchorTags.map(anchorTagContents => {
    return {
      text: getText(anchorTagContents),
      href: getHref(anchorTagContents),
    };
  });
};

export function getLinkObjects(html: string): LinkObject[] {
  return createLinkObjects(getContentsBetweenAllAnchorTags(html));
};

export interface LinkObject {
  text: string,
  href: string,
};