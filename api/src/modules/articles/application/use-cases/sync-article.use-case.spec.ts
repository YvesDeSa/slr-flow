import { Test, TestingModule } from '@nestjs/testing';
import { SyncArticleUseCase } from './sync-article.use-case';
import { getModelToken } from '@nestjs/mongoose';
import { Article } from '../../domain/schemas/article.schema';
import { SemanticScholarService } from '../../domain/services/semantic-scholar.service';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { ConflictException } from '@nestjs/common';

describe('SyncArticleUseCase', () => {
  let useCase: SyncArticleUseCase;
  let articleModel: any;
  let semanticScholarService: any;
  let storageService: any;

  const mockArticleModel = function(dto) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'mock-id' });
  };
  mockArticleModel.findOne = jest.fn();

  const mockSemanticScholarService = {
    fetchByDoi: jest.fn(),
    downloadPdf: jest.fn(),
  };

  const mockStorageService = {
    uploadBuffer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncArticleUseCase,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
        {
          provide: SemanticScholarService,
          useValue: mockSemanticScholarService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    useCase = module.get<SyncArticleUseCase>(SyncArticleUseCase);
    articleModel = module.get(getModelToken(Article.name));
    semanticScholarService = module.get(SemanticScholarService);
    storageService = module.get(StorageService);
  });

  it('should throw ConflictException if article already exists', async () => {
    articleModel.findOne.mockResolvedValue({ doi: '123' });
    await expect(useCase.execute('123')).rejects.toThrow(ConflictException);
  });

  it('should sync article successfully without PDF', async () => {
    const doi = '10.1234/test';
    const metadata = {
      title: 'Test Title',
      authors: ['Author 1'],
      year: 2023,
      abstract: 'Test Abstract',
      pdfUrl: null,
    };

    articleModel.findOne.mockResolvedValue(null);
    semanticScholarService.fetchByDoi.mockResolvedValue(metadata);

    const result = await useCase.execute(doi);

    expect(result).toBeDefined();
    expect(semanticScholarService.fetchByDoi).toHaveBeenCalledWith(doi);
    expect(storageService.uploadBuffer).not.toHaveBeenCalled();
  });

  it('should sync article and upload PDF if available', async () => {
    const doi = '10.1234/test-pdf';
    const metadata = {
      title: 'Test PDF Title',
      authors: ['Author 1'],
      year: 2023,
      abstract: 'Test Abstract',
      pdfUrl: 'http://example.com/test.pdf',
    };
    const buffer = Buffer.from('test');

    articleModel.findOne.mockResolvedValue(null);
    semanticScholarService.fetchByDoi.mockResolvedValue(metadata);
    semanticScholarService.downloadPdf.mockResolvedValue(buffer);
    storageService.uploadBuffer.mockResolvedValue('sanitized-doi.pdf');

    const result = await useCase.execute(doi);

    expect(result).toBeDefined();
    expect(semanticScholarService.downloadPdf).toHaveBeenCalledWith(metadata.pdfUrl);
    expect(storageService.uploadBuffer).toHaveBeenCalledWith(buffer, doi);
  });
});
