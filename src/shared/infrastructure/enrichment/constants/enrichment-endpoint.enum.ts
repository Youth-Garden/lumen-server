/**
 * Centralized enum for all external API endpoints used in vocabulary enrichment.
 */
export enum EnrichmentEndpointEnum {
  // Image Providers
  PIXABAY_IMAGE = 'https://pixabay.com/api/',
  UNSPLASH_IMAGE = 'https://api.unsplash.com/search/photos',
  PEXELS_IMAGE = 'https://api.pexels.com/v1/search',
  WIKIMEDIA_COMMONS = 'https://commons.wikimedia.org/w/api.php',
  WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php',

  // Dictionary Providers
  FREE_DICTIONARY = 'https://api.dictionaryapi.dev/api/v2/entries/en',
  DATAMUSE_DICTIONARY = 'https://api.datamuse.com/words',

  // Translation Providers
  GOOGLE_CHROME_TRANSLATE = 'https://clients5.google.com/translate_a/t',
  GOOGLE_GTX_TRANSLATE = 'https://translate.googleapis.com/translate_a/single',
  MYMEMORY_TRANSLATE = 'https://api.mymemory.translated.net/get',
}
