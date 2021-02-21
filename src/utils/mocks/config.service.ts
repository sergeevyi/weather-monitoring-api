export const mockedConfigService: any = {
  get(key: string) {
    switch (key) {
      case 'FREQUENCY':
        return '10000';
      case 'MONGODB_CONNECTION':
        return 'mongodb://localhost:27017/weather_forecast';
      case 'WEATHER_PROVIDER':
        return 'weatherapi';
    }
  },
};
