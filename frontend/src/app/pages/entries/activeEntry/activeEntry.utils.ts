import { initialSettings, SettingsMap } from './answer.static';

export function initialSettingsFn<T extends keyof SettingsMap>(type: T): SettingsMap[T] {
  return initialSettings[type];
}
