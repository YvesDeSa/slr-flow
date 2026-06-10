import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticleDocument } from "../../domain/schemas/article.schema";
import { SemanticScholarService } from "../../domain/services/semantic-scholar.service";
import { StorageService } from "../../infrastructure/storage/storage.service";

@Injectable()
export class SyncArticleUseCase {
  private readonly logger = new Logger(SyncArticleUseCase.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly semanticScholarService: SemanticScholarService,
    private readonly storageService: StorageService,
  ) {}

  async execute(doi: string): Promise<Article> {
    this.logger.log(`Iniciando sincronização para DOI: ${doi}`);

    // Verificar se já existe
    const existing = await this.articleModel.findOne({ doi });
    if (existing) {
      throw new ConflictException(
        `Artigo com DOI ${doi} já existe no sistema.`,
      );
    }

    // 1. Busca de Metadados
    const metadata = await this.semanticScholarService.fetchByDoi(doi);
    if (!metadata) {
      throw new Error(
        `Não foi possível encontrar metadados para o DOI: ${doi}`,
      );
    }

    let minioPath: string | null = null;

    // 2. Download do Arquivo e 3. Armazenamento no MinIO
    if (metadata.pdfUrl) {
      const pdfBuffer = await this.semanticScholarService.downloadPdf(
        metadata.pdfUrl,
      );
      if (pdfBuffer) {
        minioPath = await this.storageService.uploadBuffer(pdfBuffer, doi);
      }
    }

    // 4. Persistência no Banco de Dados
    const newArticle = new this.articleModel({
      doi,
      title: metadata.title,
      authors: metadata.authors,
      year: metadata.year,
      abstract: metadata.abstract,
      pdfUrl: metadata.pdfUrl,
      minioPath,
      status: "PENDING", // Garantindo o status inicial como PENDING
    });

    const saved = await newArticle.save();
    this.logger.log(`Artigo salvo com sucesso: ${saved.title}`);

    return saved;
  }
}
