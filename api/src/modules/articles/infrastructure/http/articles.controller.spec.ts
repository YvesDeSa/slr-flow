import { Test, TestingModule } from "@nestjs/testing";
import { ArticlesController } from "./articles.controller";
import { SyncArticleUseCase } from "../../application/use-cases/sync-article.use-case";
import { getModelToken } from "@nestjs/mongoose";
import { Article } from "../../domain/schemas/article.schema";

describe("ArticlesController", () => {
  let controller: ArticlesController;

  const mockSyncArticleUseCase = {
    execute: jest.fn(),
  };

  const mockArticleModel = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: SyncArticleUseCase,
          useValue: mockSyncArticleUseCase,
        },
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
