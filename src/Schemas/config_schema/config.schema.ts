import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop({ required : true })
  key: string

  @Prop({ required: true })
  value: string

  @Prop({ required: true })
  description: string

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ConfigSchema = SchemaFactory.createForClass(Config)