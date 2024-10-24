import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FAQ {
  @Prop({
    required: true,
    unique: true,
  })
  title: string;

  @Prop({
    required: true,
    unique: true,
  })
  description: string;

  @Prop({
    required: true,
    unique: true,
  })
  youtubeVideoLink: string;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ)