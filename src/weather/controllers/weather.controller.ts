import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from '../services/weather.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherDTO } from '../dto/weather.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}
  @ApiResponse({
    status: 200,
    description: 'Get weather alerts',
    type: WeatherDTO,
  })
  @ApiQuery({
    name: 'city',
    description: 'City',
    required: false,
    type: String,
  })
  @Get()
  public async getAll(@Query('city') city) {
    const weatherList: WeatherDTO[] = await this.weatherService.findAll(city);
    return weatherList;
  }
}
