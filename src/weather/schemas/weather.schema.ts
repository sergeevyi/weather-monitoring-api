import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Weather extends Document {
  @Prop()
  city: string;

  @Prop()
  temp: number;

  @Prop()
  date: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
