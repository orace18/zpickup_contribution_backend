import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Config {
  @Prop({ required : true })
  key: string

  @Prop({ required: true })
  value: string
}

export const ConfigSchema = SchemaFactory.createForClass(Config)