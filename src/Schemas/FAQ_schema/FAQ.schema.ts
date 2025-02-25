import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FAQDocument = FAQ & Document;

@Schema()
export class FAQ {
  @Prop({})
  key: string;

  @Prop({
    required: true,
    unique: true,
  })
  title: string;

  @Prop({})
  description?: string;

  @Prop({})
  youtube_video_link?: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);
