import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { WeatherApiProvider } from './weatherapi.provider';

describe('WeatherApiProvider', () => {
  let service: WeatherApiProvider;
  let httpService: HttpService;

  beforeEach(async () => {
    const fakeProductModel = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [WeatherApiProvider],
    }).compile();
    service = module.get<WeatherApiProvider>(WeatherApiProvider);
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
    service.getWeatherByCity('Berlin', 12, 'apikey').subscribe({
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
        data: require('../../utils/mocks/weatherapi_resp.json'),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );
    let data = {};
    service.getWeatherByCity('Berlin', 12, 'apikey').subscribe({
      next: (val) => {
        data = val;
      },
      error: (err) => {
        throw err;
      },
      complete: () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const openWeatherMapExpect = require('../../utils/mocks/weatherapi_expect.json');
        openWeatherMapExpect.map((item) => (item.date = new Date(item.date)));
        expect(data).toEqual(openWeatherMapExpect);
        done();
      },
    });
  });

  it('should do get request and get response with incorrect data ( temp field is missing )', (done) => {
    jest.spyOn(service['httpService'], 'get').mockReturnValue(
      of({
        data: require('../../utils/mocks/weatherapi_incorect_data_resp.json'),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );
    let data = {};
    service.getWeatherByCity('Berlin', 12, 'apikey').subscribe({
      next: (val) => {
        data = val;
      },
      error: (err) => {
        throw err;
      },
      complete: () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const openWeatherMapExpect = require('../../utils/mocks/weatherapi_incorect_data_expect.json');
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
    service.getWeatherByCity('Berlin', 12, 'apikey').subscribe({
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
