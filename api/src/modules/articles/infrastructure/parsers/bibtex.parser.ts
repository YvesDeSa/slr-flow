import * as bibtexParse from 'bibtex-parse-js';

export class BibtexParser {
  static parse(rawContent: string) {
    const entries = bibtexParse.toJSON(rawContent);

    return entries.map((entry) => ({
      title: entry.entryTags.title?.replace(/{|}/g, '') || 'Sem título',
      authors: entry.entryTags.author || 'Autor desconhecido',
      year: parseInt(entry.entryTags.year) || new Date().getFullYear(),
      journal: entry.entryTags.journal || '',
      doi: entry.entryTags.doi || null,
      abstract: entry.entryTags.abstract || null,
    }));
  }
}