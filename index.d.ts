declare var JMSPublicPath: string;
declare var JMSProxyPath: string;
declare var jQuery;
declare var $;

declare module 'jQuery';
declare module 'classnames';
declare module 'lodash';
declare module 'js-cookie';
declare module 'crypto-js';
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
