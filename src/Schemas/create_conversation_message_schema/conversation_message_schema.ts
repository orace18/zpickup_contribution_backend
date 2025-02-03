import { Types } from "mongoose";
import { Users } from "../users_schema/Users.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Conversation } from "../conversation_schema/conversation.schema";

export type ConversationMessageDocument = ConversationMessage & Document;

export enum FileType {
    TEXT = 'text',
    IMAGE = 'image',
    AUDIO = 'audio',
    VIDEO = 'video',
}

@Schema({ timestamps: true })
export class ConversationMessage {
    @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
    conversation: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    sender: Types.ObjectId;

    @Prop({ required: true })
    text: string;

    @Prop({ type: String, enum: FileType, required: false })
    fileType?: FileType;

    @Prop({ required: false })
    fileUrl?: string;

    @Prop({ default: false })
    isRead: boolean;
}


export const ConversationMessageSchema = SchemaFactory.createForClass(ConversationMessage);