import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WeatherModule } from './weather/weather.module';

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  app.setGlobalPrefix('api/v1');
  const options = new DocumentBuilder()
    .setTitle('Weather Monitoring')
    .setDescription(
      'The app monitors weather forecasts for specific locations.',
    )
    .setVersion('1.0')
    .addTag('Weather Monitoring')
    .build();
  const apppDocument = SwaggerModule.createDocument(app, options, {
    include: [WeatherModule],
  });
  SwaggerModule.setup('/swagger', app, apppDocument);

  await app.listen(3000);
}
bootstrap();
