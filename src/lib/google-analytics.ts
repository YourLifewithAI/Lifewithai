// Measurement IDs are public identifiers, not credentials.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';
export const ANALYTICS_CHOICE_KEY = 'lifewithai:google-analytics:v1';
export const ANALYTICS_SETTINGS_EVENT = 'lifewithai:analytics-settings';
const CHOICE_LIFETIME = 180 * 24 * 60 * 60 * 1000;

export type AnalyticsChoice = 'accepted' | 'declined';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function analyticsAvailable() {
  return /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) &&
    ['lifewithai.ai', 'www.lifewithai.ai'].includes(window.location.hostname);
}

export function readAnalyticsChoice(): AnalyticsChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(ANALYTICS_CHOICE_KEY) ?? 'null');
    if (saved && (saved.choice === 'accepted' || saved.choice === 'declined') &&
        typeof saved.expires === 'number' && saved.expires > Date.now()) {
      return saved.choice;
    }
  } catch { /* A blocked or invalid local store must not grant consent. */ }
  return null;
}

export function saveAnalyticsChoice(choice: AnalyticsChoice) {
  try {
    localStorage.setItem(ANALYTICS_CHOICE_KEY, JSON.stringify({
      choice, expires: Date.now() + CHOICE_LIFETIME,
    }));
  } catch { /* The current-page choice still works without local storage. */ }
}

export function startGoogleAnalytics(choice: AnalyticsChoice | null) {
  if (choice !== 'accepted' || !analyticsAvailable() || document.getElementById('lifewithai-google-tag')) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  // Enhanced measurement handles the initial page and Next.js history changes.
  // Do not also emit manual page_view events, which would double-count navigation.
  window.gtag('config', GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: CHOICE_LIFETIME / 1000,
  });
  const script = document.createElement('script');
  script.id = 'lifewithai-google-tag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function stopGoogleAnalytics() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  // Clear only this site's Google Analytics cookies, preserving login cookies.
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (name !== '_ga' && name !== `_ga_${GA_MEASUREMENT_ID.slice(2)}`) continue;
    for (const domain of ['', window.location.hostname, '.lifewithai.ai']) {
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ''}`;
    }
  }
  // A fresh page removes the running tag and its automatic event listeners.
  if (document.getElementById('lifewithai-google-tag')) window.location.reload();
}

export function trackSubstackClick(href: string) {
  if (!analyticsAvailable() ||
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]) return;
  const destination = new URL(href, window.location.href);
  if (destination.hostname !== 'sbcorvus.substack.com') return;
  window.gtag?.('event', 'substack_click', {
    link_url: destination.origin + destination.pathname,
    link_domain: destination.hostname,
    source_page: window.location.pathname,
    transport_type: 'beacon',
  });
}
