import { IWeatherProvider } from '../interfaces/weatherprovider.interface';
import { catchError, map } from 'rxjs/operators';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { WeatherDTO } from '../dto/weather.dto';
import { Forecastday, WeatherApiRespDto } from '../dto/weatherapi_resp.dto';

@Injectable()
export class WeatherApiProvider implements IWeatherProvider {
  constructor(private httpService: HttpService) {}
  private readonly logger = new Logger(WeatherApiProvider.name);

  getWeatherByCity = (
    city: string,
    limit: number,
    api_key: string,
  ): Observable<WeatherDTO[]> => {
    return this.httpService
      .get(
        'https://api.weatherapi.com/v1/forecast.json?key=' +
          api_key +
          '&q=' +
          city +
          '&days=5',
      )
      .pipe(
        map((response) => {
          const forecastList: WeatherApiRespDto = response.data;
          return forecastList.forecast.forecastday
            .filter(
              (item) =>
                item.date && item.day.avgtemp_c && item.day.avgtemp_c < limit,
            )
            .map(
              (item: Forecastday) =>
                new WeatherDTO(
                  city.toLowerCase(),
                  item.day.avgtemp_c,
                  new Date(Date.parse(item.date + 'T00:00:00.000Z')),
                ),
            );
        }),
        catchError((err) => {
          this.logger.error(err);
          return throwError(err);
        }),
      );
  };
}
