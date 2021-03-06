import { HttpModule, Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './controllers/weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { WeatherApiProvider } from './providers/weatherapi.provider';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/tasks.service';

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
    TasksService,
    {
      provide: 'WEATHERAPI',
      useClass: WeatherApiProvider,
    },
    {
      provide: 'OPENWEATHERMAP',
      useClass: OpenWeatherMapProvider,
    },
  ],
  controllers: [WeatherController],
})
export class WeatherModule {}
