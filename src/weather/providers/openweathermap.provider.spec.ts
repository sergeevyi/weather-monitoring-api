import { Test, TestingModule } from '@nestjs/testing';
import { OpenWeatherMapProvider } from './openweathermap.provider';
import { HttpModule, HttpService } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('OpenWeatherMapService', () => {
  let service: OpenWeatherMapProvider;
  let httpService: HttpService;

  const mockWeatherProviderService = () => ({
    getWeatherByCity: jest.fn(),
  });

  beforeEach(async () => {
    const fakeProductModel = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OpenWeatherMapProvider],
    }).compile();
    service = module.get<OpenWeatherMapProvider>(OpenWeatherMapProvider);
    httpService = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error if request failed', (done) => {
    jest
      .spyOn(service['httpService'], 'get')
      .mockReturnValue(throwError('request failed'));
    let data = {};
    service.getWeatherByCity('Helsinki', -6, 'apikey').subscribe({
      next: (val) => {
        data = val;
      },
      error: (err) => {
        expect(err).toBe('request failed');
        done();
      },
      complete: () => {
        expect(data).toBeUndefined();
        done();
      },
    });
  });

  it('should do get request and return entries', (done) => {
    jest.spyOn(service['httpService'], 'get').mockReturnValue(
      of({
        data: require('../../utils/mocks/openweather_resp.json'),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );
    let data = {};
    service.getWeatherByCity('Helsinki', -6, 'apikey').subscribe({
      next: (val) => {
        data = val;
      },
      error: (err) => {
        throw err;
      },
      complete: () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const openWeatherMapExpect = require('../../utils/mocks/openweather_expect.json');
        openWeatherMapExpect.map((item) => (item.date = new Date(item.date)));
        expect(data).toEqual(openWeatherMapExpect);
        done();
      },
    });
  });

  it('should do get request and get response with incorrect data ( temp field is missing )', (done) => {
    jest.spyOn(service['httpService'], 'get').mockReturnValue(
      of({
        data: require('../../utils/mocks/openweather_incorect_data_resp.json'),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );
    let data = {};
    service.getWeatherByCity('Helsinki', -6, 'apikey').subscribe({
      next: (val) => {
        data = val;
      },
      error: (err) => {
        throw err;
      },
      complete: () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const openWeatherMapExpect = require('../../utils/mocks/openweather_incorect_data_expect.json');
        openWeatherMapExpect.map((item) => (item.date = new Date(item.date)));
        expect(data).toEqual(openWeatherMapExpect);
        done();
      },
    });
  });

  it('should do get request and return 4xx error', (done) => {
    jest.spyOn(service['httpService'], 'get').mockImplementation(() => {
      return throwError(new Error('Request failed with status code 401'));
    });
    service.getWeatherByCity('Helsinki', -6, 'apikey').subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Request failed with status code 401');
        done();
      },
      complete: () => {
        expect(service).toBeCalledTimes(1);
        done();
      },
    });
  });
});
