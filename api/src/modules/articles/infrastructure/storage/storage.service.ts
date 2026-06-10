import { Injectable, Logger } from "@nestjs/common";
import * as Minio from "minio";
import { Stream } from "stream";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;
  private readonly bucketName = "articles-pdfs";

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || "localhost",
      port: parseInt(process.env.MINIO_PORT || "9000"),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
      secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    });

    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Bucket ${this.bucketName} criado com sucesso.`);
      }
    } catch (error) {
      this.logger.error(`Erro ao verificar/criar bucket: ${error.message}`);
    }
  }

  async uploadBuffer(buffer: Buffer, fileName: string): Promise<string | null> {
    try {
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const objectName = `${sanitizedFileName}.pdf`;

      await this.minioClient.putObject(this.bucketName, objectName, buffer);

      this.logger.log(`Buffer salvo no MinIO: ${objectName}`);
      return objectName;
    } catch (error) {
      this.logger.error(`Falha ao salvar buffer no MinIO: ${error.message}`);
      return null;
    }
  }

  private sanitizeFileName(fileName: string): string {
    // Remove caracteres problemáticos para nomes de arquivos
    // DOIs costumam ter '/' que criam subpastas no S3. Substituímos por '-'
    return fileName.replace(/[/\\?%*:|"<>]/g, "-");
  }
}
