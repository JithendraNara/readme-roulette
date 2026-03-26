/**
 * GitHub Trending Integration
 * Fetches trending repos from ghapi.huchen.dev, caches them,
 * and provides a random picker for the roulette experience.
 */

const TRENDING_API = 'https://ghapi.huchen.dev';

export interface TrendingRepo {
  author: string;
  name: string;
  avatar: string;
  url: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  currentPeriodStars: number;
  builtBy: Array<{ href: string; avatar: string; username: string }>;
}

export interface TrendingResponse {
  repositories: TrendingRepo[];
  developers: unknown[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const TRENDING_CACHE_DURATION = 30 * 1000; // 30 seconds — refresh on every scan
const CACHE: Map<string, CacheEntry<unknown>> = new Map();

/**
 * Fetch trending repositories from the API.
 * Results are cached for 5 minutes to avoid hammering the API.
 */
export async function fetchTrending(params: {
  language?: string;
  since?: 'daily' | 'weekly' | 'monthly';
  spokenLanguageCode?: string;
} = {}): Promise<TrendingRepo[]> {
  const { language, since = 'daily', spokenLanguageCode } = params;

  const queryParams = new URLSearchParams();
  if (language) queryParams.set('language', language);
  queryParams.set('since', since);
  if (spokenLanguageCode) queryParams.set('spoken_language_code', spokenLanguageCode);

  const cacheKey = `trending:${queryParams.toString()}`;
  const cached = CACHE.get(cacheKey) as CacheEntry<TrendingRepo[]> | undefined;

  if (cached && Date.now() - cached.timestamp < TRENDING_CACHE_DURATION) {
    return cached.data;
  }

  const url = `${TRENDING_API}/repositories?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Trending API error: ${response.status}`);
  }

  const data: TrendingRepo[] = await response.json();

  // Filter out repos without meaningful descriptions
  const filtered = data.filter(
    (repo) => repo.description && repo.description.length > 20
  );

  CACHE.set(cacheKey, { data: filtered, timestamp: Date.now() });
  return filtered;
}

/**
 * Fetch all supported programming languages from the API.
 */
export async function fetchLanguages(): Promise<Array<{ urlParam: string; name: string }>> {
  const cacheKey = 'languages';
  const cached = CACHE.get(cacheKey) as CacheEntry<Array<{ urlParam: string; name: string }>> | undefined;

  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    return cached.data;
  }

  const response = await fetch(`${TRENDING_API}/languages`);
  if (!response.ok) throw new Error(`Languages API error: ${response.status}`);

  const data: Array<{ urlParam: string; name: string }> = await response.json();
  CACHE.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

/**
 * Pick a random trending repo, optionally filtered by language.
 * Uses fresh daily trending data for maximum variety.
 */
export async function getRandomTrendingRepo(language?: string): Promise<TrendingRepo> {
  // Always fetch fresh — no long-term cache on individual picks
  const repos = await fetchTrending({ language, since: 'daily' });

  if (repos.length === 0) {
    throw new Error('No trending repos found. Try a different language.');
  }

  // Fisher-Yates shuffle then pick first — avoids top-of-list bias
  const shuffled = [...repos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled[0];
}

/**
 * Fetch the raw README content for a GitHub repo.
 */
export async function fetchReadme(author: string, name: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${author}/${name}/HEAD/README.md`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Try common alternatives
      const altUrl = `https://raw.githubusercontent.com/${author}/${name}/main/README.md`;
      const altResponse = await fetch(altUrl);
      if (!altResponse.ok) {
        throw new Error(`README not found (${response.status})`);
      }
      return await altResponse.text();
    }
    return await response.text();
  } catch {
    throw new Error(`Failed to fetch README for ${author}/${name}`);
  }
}
