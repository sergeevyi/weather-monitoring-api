export interface City {
  name: string;
  limit: number;
}

export interface IConfig {
  frequency: number;
  cities: City[];
}
