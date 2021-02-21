import { HttpModule, Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './controllers/weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { WeatherapiProvider } from './providers/weatherapi.provider';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const MONGODB_CONNECTION = configService.get<string>(
          'MONGODB_CONNECTION',
        );
        return {
          uri: MONGODB_CONNECTION,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    WeatherService,
    {
      provide: 'WEATHERAPI',
      useClass: WeatherapiProvider,
    },
    {
      provide: 'OPENWEATHERMAP',
      useClass: OpenWeatherMapProvider,
    },
  ],
  controllers: [WeatherController],
})
export class WeatherModule {}
