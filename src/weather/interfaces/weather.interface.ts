import { Document } from 'mongoose';

export interface IWeather extends Document {
  city: string;
  temp: number;
  date: Date;
}
