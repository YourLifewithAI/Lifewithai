// Light or dark pages (Ben, 2026-11-15). Every reader gets the light pages, whatever their device is set to; the moon
// by Subscribe turns the pages dark, the sun turns them back. The choice is kept in this browser's localStorage.
// The colours themselves are the tokens in src/app/globals.css; THEME_COLOR matches --paper (the sticky bar at the top
// of the page) in each mode.
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';
export const THEME_EVENT = 'site-theme';
export const THEME_COLOR: Record<Theme, string> = { light: '#F8FAFC', dark: '#1B232B' };

/** Runs in <head> before anything is painted: a saved "dark" sets data-theme on <html>. It also adds the page's one
 *  theme-color meta tag (the browser's bar colour) for the mode in use; the sun and moon change its colour. The layout
 *  has no theme-color of its own, so there is exactly one: React matches a server meta tag by its content, and one the
 *  script recoloured got a second copy beside it. Without JavaScript, the layout's <noscript> gives the light one. */
export const themeScript =
  `(function(){var d=document,dark=false;` +
  `try{dark=localStorage.getItem(${JSON.stringify(THEME_KEY)})==='dark'}catch(e){}` +
  `if(dark)d.documentElement.setAttribute('data-theme','dark');` +
  `var m=d.createElement('meta');m.name='theme-color';` +
  `m.content=dark?${JSON.stringify(THEME_COLOR.dark)}:${JSON.stringify(THEME_COLOR.light)};` +
  `d.head.appendChild(m)})()`;
