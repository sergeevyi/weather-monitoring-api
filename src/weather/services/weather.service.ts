import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from '../schemas/weather.schema';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { IWeatherProvider } from '../interfaces/weatherprovider.interface';
import { WeatherDTO } from '../dto/weather.dto';
import { City, IConfig } from '../interfaces/config.interface';
import { ModuleRef } from '@nestjs/core';
import getSettings from '../../utils/helpers';

@Injectable()
export class WeatherService implements OnModuleInit {
  private weatherProviderService: IWeatherProvider;
  private frequency = 10000;

  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
    private schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
    private moduleRef: ModuleRef,
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

  async onModuleInit() {
    this.weatherProviderService = await this.moduleRef.get(
      this.configService.get<string>('WEATHER_PROVIDER'),
    );
    const config = await getSettings(
      this.configService.get<string>('CONFIG_FILE'),
    );
    if (config) {
      this.frequency = config.frequency;
      this.startWeatherJob(this.frequency);
    } else {
      this.logger.error('No config set');
    }
  }

  private startWeatherJob = (frequency: number) => {
    const interval = setInterval(() => this.handleWeatherJob(), frequency);
    this.schedulerRegistry.addInterval('weatherJob', interval);
  };

  // Check the settings file every 1 min for changes. If the frequency has been changed, restart a scheduled task with a new frequency
  @Interval(60000)
  async checkSettings() {
    const config = await getSettings(
      this.configService.get<string>('CONFIG_FILE'),
    );
    if (config && this.frequency !== config.frequency) {
      this.schedulerRegistry.deleteInterval('weatherJob');
      this.startWeatherJob(config.frequency);
      this.frequency = config.frequency;
    }
  }

  async handleWeatherJob() {
    this.weatherModel.collection
      .deleteMany({})
      .catch((err) => this.logger.error(err));
    const config = await getSettings(
      this.configService.get<string>('CONFIG_FILE'),
    );
    const api_key = this.configService.get<string>('WEATHERAPI_KEY');
    if (api_key) {
      config.cities.forEach((city: City) => {
        this.weatherProviderService
          .getWeatherByCity(city.name, city.limit, api_key)
          .subscribe(
            (items: WeatherDTO[]) => {
              this.weatherModel
                .create(items)
                .catch((err) => this.logger.error(err));
            },
            (error) => {
              this.logger.error(error);
            },
          );
      });
    } else {
      this.logger.warn('No API key set');
    }
  }
}
