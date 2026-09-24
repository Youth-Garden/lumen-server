import axios from 'axios';

export interface ParsedNgslRow {
  term: string;
  rank: number;
  partOfSpeech?: string;
  definitionEn?: string;
  definitionVi?: string;
}

export async function fetchAndParseNgslCsv(
  csvUrl: string,
): Promise<ParsedNgslRow[]> {
  try {
    const response = await axios.get<string>(csvUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Lumen-Vocab-Seeder/1.0',
      },
    });

    const lines = response.data.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length === 0) return [];

    const results: ParsedNgslRow[] = [];
    const termSet = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = parseCsvLine(line);
      const rawTerm = columns[0] || columns[1] || '';
      const cleanTerm = rawTerm
        .trim()
        .toLowerCase()
        .replace(/[^a-z'-]/g, '');

      if (!cleanTerm || cleanTerm.length < 2 || termSet.has(cleanTerm)) {
        continue;
      }

      termSet.add(cleanTerm);
      const rank = parseInt(columns[1] || columns[0] || `${i}`, 10) || i;

      results.push({
        term: cleanTerm,
        rank: isNaN(rank) ? i : rank,
      });
    }

    return results;
  } catch (error) {
    console.warn(
      `[NGSL Parser] Could not download from ${csvUrl}:`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField.trim());
  return fields;
}
