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
  youtube_video_link: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);
