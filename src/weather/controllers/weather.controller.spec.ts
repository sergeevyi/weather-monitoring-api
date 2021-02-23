import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from '../services/weather.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { ConfigService } from '@nestjs/config';
import { WeatherModule } from '../weather.module';

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

    jest.spyOn(weatherService, 'findAll').mockResolvedValue(weatherList);
    expect(await controller.getAll(null)).toBe(weatherList);
  });

  it('should return an empty array', async () => {
    const weatherList: any = [];
    jest.spyOn(weatherService, 'findAll').mockResolvedValue(weatherList);
    expect(await controller.getAll(null)).toBe(weatherList);
  });
});
