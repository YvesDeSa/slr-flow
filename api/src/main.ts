import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("SLR Flow API")
    .setDescription(
      "API para automação de Revisão Sistemática da Literatura (SLR)",
    )
    .setVersion("1.0")
    .addTag("articles")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Integração com Scalar
  app.use(
    "/reference",
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port: ${process.env.PORT ?? 3000}`);
  console.log(
    `API Documentation: http://localhost:${process.env.PORT ?? 3000}/reference`,
  );
}
bootstrap();
