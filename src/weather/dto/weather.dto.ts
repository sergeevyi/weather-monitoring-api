import { ApiProperty } from '@nestjs/swagger';

export class WeatherDTO {
  @ApiProperty({ description: 'City' })
  city: string;
  @ApiProperty({ description: 'Temperature Celsius' })
  temp: number;
  @ApiProperty({ description: 'Date' })
  date: Date;

  constructor(city: string, temp: number, date: Date) {
    this.city = city;
    this.temp = temp;
    this.date = date;
  }
}
