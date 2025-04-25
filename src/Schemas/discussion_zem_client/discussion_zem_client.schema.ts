import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class DiscussionZemClient {
    @Prop({
        type: {
            zem: { type: Types.ObjectId, ref: 'Users', required: true },
            customer: { type: Types.ObjectId, ref: 'Users', required: true }
        },
        required: true
    })
    creators: {
        zem: Types.ObjectId;
        customer: Types.ObjectId;
    };

    @Prop({ type: Types.ObjectId, ref: 'Races', required: true })
    race: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'DiscussionZemClientMessage' }], default: [] })
    messages: Types.ObjectId[];

    @Prop({ type: Boolean, default: true })
    is_active: boolean;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;

  
}

export const DiscussionZemClientSchema = SchemaFactory.createForClass(DiscussionZemClient);