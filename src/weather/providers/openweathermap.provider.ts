import { IWeatherProvider } from '../interfaces/weatherprovider.interface';
import { map } from 'rxjs/operators';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
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
          const todos: OpenWeatherMapRespDto = response.data;
          return todos.list
            .filter((item) => item.main.temp < limit)
            .map(
              (item: List) =>
                new WeatherDTO(
                  city.toLowerCase(),
                  item.main.temp,
                  new Date(item.dt_txt),
                ),
            );
        }),
      );
  };
}
