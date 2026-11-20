const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const sitePath = (pathname: `/${string}`) => `${basePath}${pathname}`;
