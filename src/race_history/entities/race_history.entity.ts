
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {CoursesStatus} from "../../Schemas/races_schema/races.schema";


@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class RaceHistory {
    @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Races', required: true })
    race: Types.ObjectId;

    @Prop({ required: true, enum: CoursesStatus })
    status: CoursesStatus;

    @Prop()
    latitude?: number;

    @Prop()
    longitude?: number;


    @Prop({ default: null })
    street: string;

    @Prop({ default: null })
    country: string;

    @Prop({ default: null })
    locality: string;


}

export const RaceHistorySchema = SchemaFactory.createForClass(RaceHistory);
