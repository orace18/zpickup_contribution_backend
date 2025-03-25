import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Discussion } from "../discussion_schema/discussion.schema";
import mongoose, { Types } from "mongoose";
import { Users } from "../users_schema/Users.schema";
import { PrimaryGeneratedColumn } from 'typeorm/typeorm-model-shim.js';

export type DiscussionMessageDocument = DiscussionMessage & Document;

@Schema({ timestamps: true })
export class DiscussionMessage {

  @PrimaryGeneratedColumn()
  _id: number;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true })
  discussion: Discussion;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  sender: Users;

    @Prop({ required: false }) 
    imageUrl?: string; // Ajout du champ image

  @Prop({ type: String }) // Nouveau champ pour l'URL du média
  mediaUrl: string;

  @Prop({ type: String }) // 'image', 'video' ou null
  mediaType: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const DiscussionMessageSchema = SchemaFactory.createForClass(DiscussionMessage);
