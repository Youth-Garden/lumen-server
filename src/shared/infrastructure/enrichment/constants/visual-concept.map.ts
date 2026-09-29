/**
 * Mapping dictionary for abstract words, adjectives, adverbs, and function words
 * to concrete visual scene search keywords for image stock APIs (Pixabay/Unsplash/Pexels).
 */
export const ABSTRACT_VISUAL_MAP: Record<string, string> = {
  // Frequency & Time
  frequent: 'calendar clock repeat timeline',
  frequently: 'calendar clock repeat timeline',
  habitual: 'daily routine habit morning',
  habitually: 'daily routine habit morning',
  rare: 'diamond rare gemstone unique',
  rarely: 'diamond rare gemstone unique',
  temporary: 'hourglass timer temporary clock',
  permanent: 'stone sculpture permanent monument',

  // Abstract Concepts & Logic
  however: 'crossroads decision signpost',
  therefore: 'logic puzzle piece consequence',
  although: 'contrast opposite direction',
  concept: 'idea lightbulb brainstorming',
  aspect: 'perspective puzzle view',
  strategy: 'chess board strategy planning',
  solution: 'key lock idea success',
  analysis: 'data charts graph analytics',
  analyze: 'data charts graph analytics',

  // Business & Action
  negotiate: 'business negotiation handshake',
  negotiation: 'business negotiation handshake',
  budget: 'finance budget calculator money',
  investment: 'growth money plant coins',
  revenue: 'sales chart growth graph',

  // Emotions & States
  anxiety: 'stressed person head in hands',
  anxious: 'stressed person head in hands',
  confident: 'confident person standing tall',
  confidence: 'confident person standing tall',
};

/**
 * Resolves an optimized visual query string for image search APIs.
 */
export function resolveVisualSearchQuery(
  term: string,
  partOfSpeech?: string | null,
  definitionEn?: string | null,
): string {
  const cleanTerm = term.trim().toLowerCase();

  // 1. Check direct abstract mapping dictionary
  if (ABSTRACT_VISUAL_MAP[cleanTerm]) {
    return ABSTRACT_VISUAL_MAP[cleanTerm];
  }

  // 2. If part of speech indicates adjective or adverb, append visual context
  const cleanPos = partOfSpeech?.toLowerCase() || '';
  if (cleanPos.includes('adj') || cleanPos.includes('adv')) {
    if (definitionEn) {
      // Pick first 2 prominent words from definition for context
      const defWords = definitionEn
        .replace(/[^a-zA-Z\s]/g, '')
        .split(/\s+/)
        .filter(
          (w) =>
            w.length > 3 &&
            !['with', 'from', 'that', 'this', 'have', 'been'].includes(
              w.toLowerCase(),
            ),
        )
        .slice(0, 2)
        .join(' ');
      if (defWords) {
        return `${cleanTerm} ${defWords}`;
      }
    }
  }

  // 3. Default fallback: use clean term directly
  return cleanTerm;
}
