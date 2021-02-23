import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { OpenWeatherMapProvider } from '../providers/openweathermap.provider';
import { getModelToken } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { Weather, WeatherSchema } from '../schemas/weather.schema';
import { IWeather } from '../interfaces/weather.interface';
import { Model } from 'mongoose';
import * as fs from 'fs';

const weatherDoc = {
  _id: '53d53d2s',
  city: 'Helsinki',
  temp: -10,
};

const today = new Date();

const weatherArray = [
  {
    city: 'Helsinki',
    date: today,
    temp: -15,
  },
  {
    city: 'Berlin',
    date: today,
    temp: -10,
  },
];

const weatherDocs = [
  {
    _id: '53d53d2s',
    city: 'Helsinki',
    date: today,
    temp: -15,
  },
  {
    _id: '53d53d2s',
    city: 'Berlin',
    date: today,
    temp: -10,
  },
];

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherModel: Model<IWeather>;

  const mockWeatherProviderService = () => ({
    getWeatherByCity: jest.fn(),
  });

  beforeEach(async () => {
    const fakeProductModel = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        WeatherService,
        {
          provide: getModelToken('Weather'),
          useValue: {
            new: jest.fn().mockResolvedValue(weatherDoc),
            constructor: jest.fn().mockResolvedValue(weatherDoc),
            find: jest.fn(),
            sort: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: OpenWeatherMapProvider,
          useFactory: mockWeatherProviderService,
        },
      ],
    }).compile();

    weatherModel = module.get(getModelToken('Weather'));
    service = module.get<WeatherService>(WeatherService);
    weatherModel = module.get<Model<IWeather>>(getModelToken('Weather'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all entries', async () => {
    jest.spyOn(weatherModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(weatherDocs),
      }),
    } as any);
    const cats = await service.findAll(null);
    expect(cats).toEqual(weatherArray);
  });

  it('should insert a new array ', async () => {
    jest
      .spyOn(weatherModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(weatherDocs));
    const newWeatherDocs = await weatherModel.create(weatherArray);
    expect(newWeatherDocs).toEqual(weatherDocs);
  });

  function wait(ms, value) {
    return new Promise((resolve) => setTimeout(resolve, ms, value));
  }

  it('should read a file and return IConfig', async () => {
    const settingsMock = {
      frequency: 30000,
      cities: [
        {
          name: 'Berlin',
          limit: 12,
        },
        {
          name: 'Helsinki',
          limit: 5,
        },
      ],
    };
    jest.useFakeTimers();
    const spy = jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(JSON.stringify(settingsMock));
    const data = await service.getSettings();
    console.log(data);
    expect(data).toEqual(settingsMock);
  });
});
