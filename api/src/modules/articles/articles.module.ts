import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticlesController } from "./infrastructure/http/articles.controller";
import { Article, ArticleSchema } from "./domain/schemas/article.schema";
import { SyncArticleUseCase } from "./application/use-cases/sync-article.use-case";
import { SemanticScholarService } from "./domain/services/semantic-scholar.service";
import { StorageService } from "./infrastructure/storage/storage.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [SyncArticleUseCase, SemanticScholarService, StorageService],
  exports: [SyncArticleUseCase],
})
export class ArticlesModule {}
