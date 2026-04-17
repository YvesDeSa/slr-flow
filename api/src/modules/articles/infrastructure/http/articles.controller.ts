import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EnrichmentService } from '../../domain/services/enrichment.service';
import { BibtexParser } from '../parsers/bibtex.parser';

@Controller('articles')
export class ArticlesController {

  constructor(
    private readonly enrichmentService: EnrichmentService,
  ) {} 

  @Post('sync')
  @HttpCode(HttpStatus.CREATED)
  async syncFromN8n(@Body() body: { bibtex: string, doi: string }) {
    const parsed = BibtexParser.parse(body.bibtex)[0];
    const finalDoi = body.doi || parsed.doi;
    let extraData = { abstract: parsed.abstract };

    if (finalDoi) {
      const enriched = await this.enrichmentService.fetchByDoi(finalDoi);
      if (enriched?.abstract) {
        extraData.abstract = enriched.abstract;
      }
    }

    const articleToSave = {
      ...parsed,
      doi: finalDoi,
      abstract: extraData.abstract,
      status: 'PENDING_REVIEW'
    };

    console.log('Objeto pronto para o Banco:', articleToSave);

    return { message: 'Artigo processado e enriquecido!' };
  }
}