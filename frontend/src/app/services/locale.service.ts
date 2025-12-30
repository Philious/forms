import { Injectable, signal } from '@angular/core';
import { Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private _internalActiveactiveLocale = signal<Locale>(Locale.SV);
  activeLocale = this._internalActiveactiveLocale.asReadonly();

  set = (key: Locale) => {
    this._internalActiveactiveLocale.set(key);
  };

  translate = (set: Translation): string => {
    const locale = this.activeLocale?.();
    if (!set) {
      console.error('Missing TranslationSet');
      debugger;
      return '';
    } else if (!locale) {
      console.error('Missing Locale');
      debugger;
      return '';
    }
    return set[this.activeLocale()];
  };
}
