import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { SyncArticleUseCase } from "../../application/use-cases/sync-article.use-case";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticleDocument } from "../../domain/schemas/article.schema";

@Controller("articles")
export class ArticlesController {
  constructor(
    private readonly syncArticleUseCase: SyncArticleUseCase,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  @Post("sync")
  @HttpCode(HttpStatus.CREATED)
  async syncByDoi(@Body() body: { doi: string }) {
    if (!body.doi) {
      throw new BadRequestException("DOI é obrigatório");
    }
    return await this.syncArticleUseCase.execute(body.doi);
  }

  @Get()
  async findAll() {
    return await this.articleModel.find().sort({ createdAt: -1 }).exec();
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
  ) {
    const validStatuses = ["PENDING", "READ", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(body.status)) {
      throw new BadRequestException(
        `Status inválido. Use um de: ${validStatuses.join(", ")}`,
      );
    }

    const updated = await this.articleModel.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Artigo com ID ${id} não encontrado`);
    }

    return updated;
  }
}
