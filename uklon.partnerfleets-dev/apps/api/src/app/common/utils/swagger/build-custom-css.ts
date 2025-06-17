export const buildCustomCss = (): string => {
  const serviceCss =
    'display: inline-block; min-width: 30px; padding: 3px 4px; text-align: center; border-radius: 3px; background-color: #757575; color: #fff; text-shadow: 0 1px 0 rgba(255, 255, 255, .1);';

  return `
    .swagger-ui .info { margin: 16px 0; }
    .swagger-ui .info .description p { font-size: 13px; }
    .swagger-ui .info .description span { margin-block-start: 2px; margin-block-end: 2px; ${serviceCss} }
    .swagger-ui .scheme-container { padding: 8px 0; }
    .swagger-ui .scheme-container .schemes .auth-wrapper .uklon-collapse-btn { margin-right: 16px; background-color: transparent; border-color: #61affe; color: #61affe; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title span { display: none; }
    .swagger-ui .opblock-summary-control:focus { outline: none; }
    .swagger-ui .opblock .opblock-summary-method { align-self: start; }
    .swagger-ui .opblock .opblock-summary-path { margin: 4px 0; }
    .swagger-ui .opblock .opblock-summary-description { margin-left: -40px; flex-basis: 100%; margin-top: 4px; display: none; }
    .swagger-ui .opblock .opblock-summary-description p { margin-block-start: 2px; margin-block-end: 2px; }
    .swagger-ui .opblock .opblock-summary-description .uklon-service { ${serviceCss} }
    .swagger-ui .opblock .opblock-summary-description .uklon-method { display: inline-block; min-width: 60px; padding: 3px 4px; text-align: center; border-radius: 3px; text-shadow: 0 1px 0 rgba(0, 0, 0, .1); }
    .swagger-ui .opblock .opblock-summary-description .uklon-get { background-color: #61affecc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-put { background-color: #fca130cc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-post { background-color: #49cc90cc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-delete { background-color: #f93e3ecc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-patch { background-color: #50e3c2cc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-head { background-color: #9012fecc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-options { background-color: #0d5aa7cc; color: #fff; }
    .swagger-ui .opblock .opblock-summary-description .uklon-url { margin-left: 4px; font-family: monospace; }
    .swagger-ui .opblock-summary-control svg { display: none; }
    .swagger-ui section.models { display: none; }
  `;
};
