import { IWeatherProvider } from '../interfaces/weatherprovider.interface';
import { catchError, map } from 'rxjs/operators';
import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { WeatherDTO } from '../dto/weather.dto';
import { List, OpenWeatherMapRespDto } from '../dto/openweathermap_resp_dto';

@Injectable()
export class OpenWeatherMapProvider implements IWeatherProvider {
  constructor(private httpService: HttpService) {}
  private readonly logger = new Logger(OpenWeatherMapProvider.name);

  getWeatherByCity = (
    city: string,
    limit: number,
    api_key: string,
  ): Observable<WeatherDTO[]> => {
    return this.httpService
      .get(
        'https://api.openweathermap.org/data/2.5/forecast?q=' +
          city +
          '&appid=' +
          api_key +
          '&units=metric',
      )
      .pipe(
        map((response) => {
          const items: OpenWeatherMapRespDto = response.data;
          return items.list
            .filter(
              (item) => item.main.temp && item.dt_txt && item.main.temp < limit,
            )
            .map(
              (item: List) =>
                new WeatherDTO(
                  city.toLowerCase(),
                  item.main.temp,
                  new Date(Date.parse(item.dt_txt + '.000Z')),
                ),
            );
        }),
        catchError((err: Error) => {
          this.logger.error(err);
          return throwError(err);
        }),
      );
  };
}
