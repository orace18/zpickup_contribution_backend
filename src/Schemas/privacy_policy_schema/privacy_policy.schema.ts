import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PrivacyPolicyDocument = PrivacyPolicy & Document;

@Schema()
export class PrivacyPolicy {
    @Prop({})
    key: string;

    @Prop({
        required: true,
        unique: true,
    })
    title: string;

    @Prop({})
    description?: string;

    @Prop({ default: new Date() })
    created_at: Date;

    @Prop({ default: new Date() })
    updated_at: Date;
}

export const PrivacyPolicySchema = SchemaFactory.createForClass(PrivacyPolicy);
