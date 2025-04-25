import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Users } from '../../Schemas/users_schema/Users.schema';

@Schema({ timestamps: true })
export class DiscussionZemClientMessage {
    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    sender: Users;

    @Prop({ type: Types.ObjectId, ref: 'DiscussionZemClient', required: true })
    discussion: Types.ObjectId;

    @Prop({ required: false })
    content?: string;

    @Prop({ required: false })
    imageUrl?: string;

    @Prop({ required: false })
    mediaUrl?: string;

    @Prop({ required: false })
    mediaType?: string;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const DiscussionZemClientMessageSchema = SchemaFactory.createForClass(DiscussionZemClientMessage);