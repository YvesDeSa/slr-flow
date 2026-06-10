import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
const request = require("supertest");
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ArticlesModule } from "../src/modules/articles/articles.module";
import { SemanticScholarService } from "../src/modules/articles/domain/services/semantic-scholar.service";
import { StorageService } from "../src/modules/articles/infrastructure/storage/storage.service";
import { getModelToken } from "@nestjs/mongoose";
import { Article } from "../src/modules/articles/domain/schemas/article.schema";

describe("ArticlesController (e2e)", () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let articleModel: any;

  const mockSemanticScholarService = {
    fetchByDoi: jest.fn(),
    downloadPdf: jest.fn(),
  };

  const mockStorageService = {
    uploadBuffer: jest.fn(),
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), ArticlesModule],
    })
      .overrideProvider(SemanticScholarService)
      .useValue(mockSemanticScholarService)
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    articleModel = moduleFixture.get(getModelToken(Article.name));
  }, 30000);

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await articleModel.deleteMany({});
    jest.clearAllMocks();
  });

  it("/articles/sync (POST) - Success", async () => {
    const doi = "10.1111/test.e2e";
    mockSemanticScholarService.fetchByDoi.mockResolvedValue({
      title: "E2E Test Article",
      authors: ["E2E Author"],
      year: 2023,
      abstract: "E2E Abstract",
      pdfUrl: null,
    });

    const response = await request(app.getHttpServer())
      .post("/articles/sync")
      .send({ doi })
      .expect(HttpStatus.CREATED);

    expect(response.body.doi).toBe(doi);
    expect(response.body.status).toBe("PENDING");

    const saved = await articleModel.findOne({ doi });
    expect(saved).toBeDefined();
    expect(saved.title).toBe("E2E Test Article");
  });

  it("/articles/:id/status (PATCH) - Success", async () => {
    const article = await new articleModel({
      doi: "10.2222/status.test",
      title: "Status Test",
      status: "PENDING",
    }).save();

    const response = await request(app.getHttpServer())
      .patch(`/articles/${article._id}/status`)
      .send({ status: "ACCEPTED" })
      .expect(HttpStatus.OK);

    expect(response.body.status).toBe("ACCEPTED");

    const updated = await articleModel.findById(article._id);
    expect(updated.status).toBe("ACCEPTED");
  });

  it("/articles/:id/status (PATCH) - Invalid Status", async () => {
    const article = await new articleModel({
      doi: "10.3333/invalid.test",
      title: "Invalid Status Test",
    }).save();

    await request(app.getHttpServer())
      .patch(`/articles/${article._id}/status`)
      .send({ status: "INVALID_STATUS" })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
