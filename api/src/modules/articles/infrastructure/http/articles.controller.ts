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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { SyncArticleUseCase } from "../../application/use-cases/sync-article.use-case";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticleDocument } from "../../domain/schemas/article.schema";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(
    private readonly syncArticleUseCase: SyncArticleUseCase,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  @Post("sync")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Sincronizar artigo via DOI" })
  @ApiBody({
    schema: {
      properties: {
        doi: { type: "string", example: "10.1016/j.jss.2023.111613" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Artigo sincronizado com sucesso." })
  @ApiResponse({ status: 409, description: "Artigo com este DOI já existe." })
  async syncByDoi(@Body() body: { doi: string }) {
    if (!body.doi) {
      throw new BadRequestException("DOI é obrigatório");
    }
    return await this.syncArticleUseCase.execute(body.doi);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os artigos" })
  @ApiResponse({
    status: 200,
    description: "Lista de artigos retornada com sucesso.",
  })
  async findAll() {
    return await this.articleModel.find().sort({ createdAt: -1 }).exec();
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Atualizar status de um artigo" })
  @ApiParam({ name: "id", description: "ID do artigo no MongoDB" })
  @ApiBody({
    schema: {
      properties: {
        status: {
          type: "string",
          enum: ["PENDING", "READ", "ACCEPTED", "REJECTED"],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Status atualizado com sucesso." })
  @ApiResponse({ status: 404, description: "Artigo não encontrado." })
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
