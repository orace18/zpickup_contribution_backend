import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Discussion } from "../discussion_schema/discussion.schema";
import mongoose, { Types } from "mongoose";
import { Users } from "../users_schema/Users.schema";
import { PrimaryGeneratedColumn } from 'typeorm/typeorm-model-shim.js';

export type DiscussionMessageDocument = DiscussionMessage & Document;

@Schema({ timestamps: true })
export class DiscussionMessage {

    /*@ Prop()
    _id: mongoose.Schema.Types.ObjectId; */
  
    @Prop()
    content: string;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true })
    discussion: Discussion;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
    sender: Users;
  
    @Prop({ required: false }) 
    imageUrl?: string;
  
    @Prop({ type: String, required: false }) 
    mediaUrl?: string;
  
    @Prop({ 
      type: String, 
      required: false, 
      enum: ['image', 'video', 'audio'] 
    }) 
    mediaType?: string;
  
    @Prop({ type: Date, default: Date.now })
    created_at: Date;
  
    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
  
}

export const DiscussionMessageSchema = SchemaFactory.createForClass(DiscussionMessage);
