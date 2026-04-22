import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EnrichmentService {
  private readonly logger = new Logger(EnrichmentService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchByDoi(doi: string) {
    try {
      const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}`;
      
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: { fields: 'title,abstract,year,authors,fieldsOfStudy' }
        })
      );

      console.log('Dados enriquecidos recebidos:', data);
      
      return {
        abstract: data.abstract,
        keywords: data.fieldsOfStudy || [],
        title: data.title,
        year: data.year
      };

    } catch (error) {
      this.logger.error(`Erro ao buscar dados para o DOI ${doi}: ${error}`);
      return null;
    }
  }
}