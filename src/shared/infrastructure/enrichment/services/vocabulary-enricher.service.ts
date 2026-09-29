import { Injectable } from '@nestjs/common';
import { resolveVisualSearchQuery } from '../constants/visual-concept.map';
import { convertAndUploadImageToWebp } from '../helpers/cloudinary-image.helper';
import { CompositeImageProvider } from '../providers/image/composite-image.provider';
import { CompositeTranslationProvider } from '../providers/translation/composite-translation.provider';
import { FreeDictionaryProvider } from '../providers/dictionary/free-dictionary.provider';
import { DatamuseDictionaryProvider } from '../providers/dictionary/datamuse-dictionary.provider';
import type {
  FullEnrichedWordResult,
  EnrichedDictionaryMetadata,
} from '../interfaces/enrichment-providers.interface';

function normalizePartOfSpeech(pos: string): string {
  const clean = pos
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, '');
  if (clean.startsWith('noun') || clean === 'n') return 'noun';
  if (clean.startsWith('verb') || clean === 'v') return 'verb';
  if (clean.startsWith('adj') || clean === 'adjective') return 'adjective';
  if (clean.startsWith('adv') || clean === 'adverb') return 'adverb';
  if (clean.startsWith('prep') || clean === 'preposition') return 'preposition';
  if (clean.startsWith('conj') || clean === 'conjunction') return 'conjunction';
  if (clean.startsWith('pron') || clean === 'pronoun') return 'pronoun';
  if (clean.startsWith('interj') || clean === 'interjection')
    return 'interjection';
  return 'noun';
}

function generateExampleSentence(term: string, pos: string): string {
  const cleanTerm = term.toLowerCase().trim();
  switch (pos) {
    case 'verb':
      return `They decided to ${cleanTerm} after careful consideration.`;
    case 'adjective':
      return `It was a very ${cleanTerm} experience for everyone involved.`;
    case 'adverb':
      return `She completed the task ${cleanTerm} and efficiently.`;
    default:
      return `The concept of ${cleanTerm} is widely recognized in daily life.`;
  }
}

@Injectable()
export class VocabularyEnricherService {
  private readonly imageProvider: CompositeImageProvider;
  private readonly translationProvider: CompositeTranslationProvider;
  private readonly freeDictProvider: FreeDictionaryProvider;
  private readonly datamuseProvider: DatamuseDictionaryProvider;

  constructor() {
    this.imageProvider = new CompositeImageProvider();
    this.translationProvider = new CompositeTranslationProvider();
    this.freeDictProvider = new FreeDictionaryProvider();
    this.datamuseProvider = new DatamuseDictionaryProvider();
  }

  async fetchImage(term: string, searchQuery?: string): Promise<string | null> {
    const query = searchQuery || resolveVisualSearchQuery(term);
    return this.imageProvider.fetchImage(query);
  }

  async fetchAndUploadWebpImage(
    term: string,
    searchQuery?: string,
  ): Promise<string | null> {
    const query = searchQuery || resolveVisualSearchQuery(term);
    const rawUrl = await this.imageProvider.fetchImage(query);
    if (!rawUrl) return null;

    const cloudinaryUrl = await convertAndUploadImageToWebp(rawUrl, {
      publicId: term,
    });
    return cloudinaryUrl || rawUrl;
  }

  async translate(
    text: string,
    targetLang = 'vi',
    sourceLang = 'en',
  ): Promise<string> {
    const res = await this.translationProvider.translate(
      text,
      targetLang,
      sourceLang,
    );
    return res || text;
  }

  async fetchDictionaryMetadata(
    term: string,
  ): Promise<EnrichedDictionaryMetadata> {
    const cleanTerm = term.trim().toLowerCase();

    // Primary: FreeDictionary API
    const freeDictMeta = await this.freeDictProvider.fetchMetadata(cleanTerm);

    // Secondary: Datamuse API fallback
    const datamuseMeta = await this.datamuseProvider.fetchMetadata(cleanTerm);

    const pos = normalizePartOfSpeech(
      freeDictMeta?.pos || datamuseMeta?.pos || 'noun',
    );
    const enDef = freeDictMeta?.enDef || datamuseMeta?.enDef || cleanTerm;
    const enExample =
      freeDictMeta?.enExample || generateExampleSentence(cleanTerm, pos);
    const phoneticUs =
      freeDictMeta?.phoneticUs || datamuseMeta?.phoneticUs || null;
    const phoneticUk =
      freeDictMeta?.phoneticUk || datamuseMeta?.phoneticUk || phoneticUs;

    const audioUsUrl =
      freeDictMeta?.audioUsUrl ||
      `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${cleanTerm}--_us_1.mp3`;
    const audioUkUrl =
      freeDictMeta?.audioUkUrl ||
      `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${cleanTerm}--_gb_1.mp3`;

    return {
      phoneticUs,
      phoneticUk,
      audioUsUrl,
      audioUkUrl,
      enDef,
      pos,
      enExample,
    };
  }

  async enrichFullWord(term: string): Promise<FullEnrichedWordResult> {
    const cleanTerm = term.trim().toLowerCase();
    const meta = await this.fetchDictionaryMetadata(cleanTerm);
    const searchQuery = resolveVisualSearchQuery(
      cleanTerm,
      meta.pos,
      meta.enDef,
    );

    const imageUrl = await this.fetchAndUploadWebpImage(cleanTerm, searchQuery);

    const definitionVi = await this.translate(meta.enDef || cleanTerm, 'vi');
    const exampleVi = meta.enExample
      ? await this.translate(meta.enExample, 'vi')
      : null;

    return {
      term: cleanTerm,
      phoneticUs: meta.phoneticUs,
      phoneticUk: meta.phoneticUk,
      audioUsUrl: meta.audioUsUrl,
      audioUkUrl: meta.audioUkUrl,
      imageUrl,
      partOfSpeech: meta.pos,
      definitionEn: meta.enDef || cleanTerm,
      definitionVi: definitionVi || meta.enDef || cleanTerm,
      exampleEn: meta.enExample,
      exampleVi,
    };
  }
}
