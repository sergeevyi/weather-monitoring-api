import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { WeatherService } from '../services/weather.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { ConfigService } from '@nestjs/config';
import { IWeather } from '../interfaces/weather.interface';
import { WeatherModule } from '../weather.module';

function setup() {
  const req = {
    params: {},
    body: {},
  };
  const res = {};
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this;
      }.bind(res),
    ),
    json: jest.fn(
      function json() {
        return this;
      }.bind(res),
    ),
    send: jest.fn(
      function send() {
        return this;
      }.bind(res),
    ),
  });
  return { req, res };
}

const mockedWeatherList = [
  {
    _id: '53d53d2s',
    city: 'Helsinki',
    temp: -10,
  },
  {
    _id: '53d53d2s',
    city: 'Helsinki',
    temp: -10,
  },
];

describe('WeatherController', () => {
  let controller: WeatherController;
  let weatherService: WeatherService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
      controllers: [WeatherController],
      providers: [
        WeatherService,
        {
          provide: WeatherService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockedWeatherList),
          },
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();
    controller = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of weather warnings', async () => {
    const weatherList: any = [
      {
        _id: '53d53d2s',
        city: 'Helsinki',
        temp: -10,
      },
    ];

    jest
      .spyOn(weatherService, 'findAll')
      .mockImplementation(
        async (): Promise<IWeather[]> => Promise.resolve(weatherList),
      );
    expect(await controller.getAll(null)).toBe(weatherList);
  });

  it('should return an empty array', async () => {
    const weatherList: any = [];
    jest
      .spyOn(weatherService, 'findAll')
      .mockImplementation(
        async (): Promise<IWeather[]> => Promise.resolve(weatherList),
      );
    expect(await controller.getAll(null)).toBe(weatherList);
  });
});
