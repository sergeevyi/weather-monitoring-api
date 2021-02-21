import { Observable } from 'rxjs';
import { WeatherDTO } from '../dto/weather.dto';

interface IWeatherProvider {
  getWeatherByCity(
    city: string,
    limit: number,
    api_key: string,
  ): Observable<WeatherDTO[]>;
}
export { IWeatherProvider };
