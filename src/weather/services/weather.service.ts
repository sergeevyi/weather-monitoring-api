import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from '../schemas/weather.schema';
import { WeatherDTO } from '../dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  private readonly logger = new Logger(WeatherService.name);

  public async findAll(city: string): Promise<WeatherDTO[]> {
    let weatherDocs = [];
    let query = {};
    if (city) {
      query = { city: city.toLowerCase() };
    }
    weatherDocs = await this.weatherModel.find(query).sort({ date: 1 }).exec();
    return weatherDocs.map((doc) => ({
      city: doc.city,
      temp: doc.temp,
      date: doc.date,
    }));
  }

}
