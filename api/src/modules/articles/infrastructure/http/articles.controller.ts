import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EnrichmentService } from '../../domain/services/enrichment.service';
import { BibtexParser } from '../parsers/bibtex.parser';

@Controller('articles')
export class ArticlesController {

  constructor(
    private readonly enrichmentService: EnrichmentService,
  ) { }

  @Post('sync')
  @HttpCode(HttpStatus.CREATED)
  async syncFromN8n(@Body() body: { doi: string }) {
    const finalDoi = body.doi;
    let extraData = { abstract: null };

    if (!finalDoi)
      console.log('DOI não fornecido, tentando extrair do BibTeX...');

    const enriched = await this.enrichmentService.fetchByDoi(finalDoi);
    
    if (enriched?.abstract) {
      extraData.abstract = enriched.abstract;
    }

    const articleToSave = {
      doi: finalDoi,
      title: enriched?.title,
      year: enriched?.year,
      status: 'PENDING_REVIEW'
    };

    console.log('Objeto pronto para o Banco:', articleToSave);

    return articleToSave;
  }
}