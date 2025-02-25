import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type TermsConditionsDocument = TermsConditions & Document;

@Schema()
export class TermsConditions {
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

export const TermsConditionsSchema = SchemaFactory.createForClass(TermsConditions);