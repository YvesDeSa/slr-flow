import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface SemanticScholarData {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  pdfUrl?: string;
}

@Injectable()
export class SemanticScholarService {
  private readonly logger = new Logger(SemanticScholarService.name);
  private readonly baseUrl = 'https://api.semanticscholar.org/graph/v1/paper';

  async fetchByDoi(doi: string): Promise<SemanticScholarData | null> {
    try {
      this.logger.log(`Buscando metadados no Semantic Scholar para o DOI: ${doi}`);
      const response = await axios.get(`${this.baseUrl}/DOI:${doi}`, {
        params: {
          fields: 'title,authors,year,abstract,openAccessPdf',
        },
      });

      const data = response.data;
      return {
        title: data.title,
        authors: data.authors?.map((a: any) => a.name) || [],
        year: data.year,
        abstract: data.abstract,
        pdfUrl: data.openAccessPdf?.url,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar no Semantic Scholar: ${error.message}`);
      return null;
    }
  }

  async downloadPdf(url: string): Promise<Buffer | null> {
    try {
      this.logger.log(`Baixando PDF de: ${url}`);
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error(`Erro ao baixar PDF: ${error.message}`);
      return null;
    }
  }
}
