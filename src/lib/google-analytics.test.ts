import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345';
const analytics = import('./google-analytics');
let scripts: Array<{ id?: string; src?: string }>;
let saved: Map<string, string>;
let cookieWrites: string[];
let reloads: number;
let originals: Record<string, PropertyDescriptor | undefined>;

beforeEach(() => {
  scripts = [];
  saved = new Map();
  cookieWrites = [];
  reloads = 0;
  originals = Object.fromEntries(['window', 'document', 'localStorage'].map(key =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.defineProperties(globalThis, {
    window: { configurable: true, value: {
      location: { hostname: 'lifewithai.ai', href: 'https://lifewithai.ai/stories/water',
        pathname: '/stories/water', reload: () => { reloads++; } },
    } },
    document: { configurable: true, value: {
      head: { appendChild: (script: { id?: string; src?: string }) => scripts.push(script) },
      createElement: () => ({}),
      getElementById: (id: string) => scripts.find(script => script.id === id),
      get cookie() { return '_ga=visitor; _ga_TEST12345=session; next-auth.session-token=keep'; },
      set cookie(value: string) { cookieWrites.push(value); },
    } },
    localStorage: { configurable: true, value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
    } },
  });
});

afterEach(() => {
  for (const [key, descriptor] of Object.entries(originals)) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

test('no Google script or queue without consent, or on preview hosts', async () => {
  const { startGoogleAnalytics } = await analytics;
  startGoogleAnalytics(null);
  startGoogleAnalytics('declined');
  assert.equal(scripts.length, 0);
  assert.equal(window.dataLayer, undefined);
  window.location.hostname = 'deploy-preview-1--example.netlify.app';
  startGoogleAnalytics('accepted');
  assert.equal(scripts.length, 0);
});

test('acceptance loads one tag and keeps advertising consent denied', async () => {
  const { startGoogleAnalytics } = await analytics;
  startGoogleAnalytics('accepted');
  startGoogleAnalytics('accepted');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST12345');
  const commands = window.dataLayer!.map(item => Array.from(item as IArguments));
  assert.equal(commands.filter(command => command[0] === 'config').length, 1);
  assert.deepEqual(commands[0], ['consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  }]);
});

test('invalid, expired, or inaccessible stored choices never grant consent', async () => {
  const { ANALYTICS_CHOICE_KEY, readAnalyticsChoice, saveAnalyticsChoice } = await analytics;
  assert.equal(readAnalyticsChoice(), null);
  saved.set(ANALYTICS_CHOICE_KEY, 'broken');
  assert.equal(readAnalyticsChoice(), null);
  saved.set(ANALYTICS_CHOICE_KEY, JSON.stringify({ choice: 'accepted', expires: Date.now() - 1 }));
  assert.equal(readAnalyticsChoice(), null);
  saveAnalyticsChoice('accepted');
  assert.equal(readAnalyticsChoice(), 'accepted');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert.equal(readAnalyticsChoice(), null);
  assert.doesNotThrow(() => saveAnalyticsChoice('declined'));
});

test('Substack event excludes query strings and unrelated destinations', async () => {
  const { startGoogleAnalytics, trackSubstackClick } = await analytics;
  startGoogleAnalytics('accepted');
  trackSubstackClick('https://example.com');
  assert.equal(window.dataLayer!.length, 3);
  trackSubstackClick('https://sbcorvus.substack.com/p/water?email=private@example.com#section');
  const event = Array.from(window.dataLayer!.at(-1) as IArguments);
  assert.equal(event[1], 'substack_click');
  assert.equal((event[2] as { link_url: string }).link_url, 'https://sbcorvus.substack.com/p/water');
  assert.equal(JSON.stringify(event).includes('private'), false);
});

test('withdrawal stops tracking and clears only Google Analytics cookies', async () => {
  const { startGoogleAnalytics, stopGoogleAnalytics, trackSubstackClick } = await analytics;
  startGoogleAnalytics('accepted');
  stopGoogleAnalytics();
  trackSubstackClick('https://sbcorvus.substack.com');
  assert.equal(window.dataLayer!.length, 3);
  assert.equal(reloads, 1);
  assert.ok(cookieWrites.some(cookie => cookie.startsWith('_ga=')));
  assert.ok(cookieWrites.some(cookie => cookie.startsWith('_ga_TEST12345=')));
  assert.ok(cookieWrites.every(cookie => !cookie.includes('next-auth')));
});
