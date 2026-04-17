import { Module } from '@nestjs/common';
import { ArticlesController } from './infrastructure/http/articles.controller';
import { EnrichmentService } from './domain/services/enrichment.service';
import { HttpModule } from '@nestjs/axios/dist/http.module';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [ArticlesController],
  providers: [EnrichmentService],
  exports: [EnrichmentService],
})
export class ArticlesModule {}
