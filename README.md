

# Weather monitoring

## Description

The app monitors weather forecasts for specific locations. If in the next five days the temperature exceeds a given lower limit, the system gives warnings in the REST API response. The app is integrated with two weather forecast services OpenWeatherMap and WeatherAPI.

## Used technologies
- NestJS
- TypeScript
- MongoDB
- Docker

## Configuration

Application configuration such as mongodb uri, weather provider, weather provider API key and location of the config file is defined in the file **.env**

Frequency (milliseconds), the list of locations (cities), and lower temperature limits to monitor are defined in a separate file **settings.json**

## Running the app
-  Clone repository
```bash
$ git clone https://github.com/onwuvic/nest-blog-api.git
```
- Populate the required parameters in .env and settings.json files

- There is a docker-compose.yml file for starting MongoDB and App with Docker.

```bash
$ docker-compose up -d
```
- Test with Swagger

REST API documentation is available on URL:
  
  http://localhost:3000/swagger

- Getting with Curl Weather warnings

```bash
$ curl -H 'content-type: application/json' -v -X GET http://localhost:3000/api/v1/weather
```

- After running, you can stop the Docker containers with
```bash
$ docker-compose down
```

## Test

```bash
docker-compose -f docker-compose-tests.yml up
```
or on the local machine

```bash
# unit tests
$ yarn run test
```



## License

[MIT licensed](LICENSE).
