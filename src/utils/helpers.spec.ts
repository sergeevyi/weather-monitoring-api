import * as fs from 'fs';
import getSettings from './helpers';

describe('Helpers', () => {
  it('should read a file and return IConfig', async () => {
    const settingsMock = {
      frequency: 30000,
      cities: [
        {
          name: 'Berlin',
          limit: 12,
        },
        {
          name: 'Helsinki',
          limit: 5,
        },
      ],
    };
    const spy = jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(JSON.stringify(settingsMock));
    const data = await getSettings('settings.json');
    expect(data).toEqual(settingsMock);
  });
});
