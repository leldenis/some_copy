export interface ServiceDescription {
  abbr: string;
  name: string;
  stage?: string;
  prod?: string;
  dev?: string;
}

export const buildCustomDescription = (services: ServiceDescription[]): string => {
  return services
    .map(({ abbr, name, dev, stage, prod }) => {
      const service = `<span>${abbr}</span>`;

      const links: string[] = [];
      if (dev) {
        links.push(`<a href="${dev}" target="_blank">dev</a>`);
      }
      if (stage) {
        links.push(`<a href="${stage}" target="_blank">stage</a>`);
      }
      if (prod) {
        links.push(`<a href="${prod}" target="_blank">prod</a>`);
      }
      const linksStr = links.length > 0 ? ` (${links.join(', ')})` : '';

      return `${service} - ${name}${linksStr}`;
    })
    .join('<br>');
};
