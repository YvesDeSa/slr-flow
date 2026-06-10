import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticlesModule } from "./modules/articles/articles.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        "mongodb://yves:yv35sslr@localhost:27017/slr_flow?authSource=admin",
    ),
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
