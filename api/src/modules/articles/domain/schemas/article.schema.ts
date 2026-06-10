import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true, unique: true })
  doi: string;

  @Prop()
  title: string;

  @Prop()
  authors: string[];

  @Prop()
  year: number;

  @Prop()
  abstract: string;

  @Prop({ type: String })
  pdfUrl?: string | null;

  @Prop({ type: String })
  minioPath?: string | null;

  @Prop({
    default: "PENDING",
    enum: ["PENDING", "READ", "ACCEPTED", "REJECTED"],
  })
  status: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
