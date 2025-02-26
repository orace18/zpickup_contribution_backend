import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Users } from "../users_schema/Users.schema";
import { DiscussionMessage } from "../discussion_message/discussion_message.schema";
import { PrimaryGeneratedColumn } from 'typeorm/typeorm-model-shim.js';

export type DiscussionDocument = Discussion & Document;

@Schema({ timestamps: true })
export class Discussion {

    @PrimaryGeneratedColumn()
    _id: number;

    @Prop({ required: true })
    title: string;

    @Prop({ type: String, required: true }) // Changé en String pour simplifier
    creator: string;

    @Prop({ type: Boolean, default: false })
    is_open: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionMessage' }], default: [] })
    messages: string[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
