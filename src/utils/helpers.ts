import * as fs from 'fs';
import { IConfig } from '../weather/interfaces/config.interface';

const getSettings = async (path: string): Promise<IConfig | null> => {
  try {
    const data: string = await fs.promises.readFile(path, 'utf8');
    const config: IConfig = JSON.parse(data);
    return config;
  } catch (err) {
    return null;
  }
};

export default getSettings;
