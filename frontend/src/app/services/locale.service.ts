import { Injectable, signal } from '@angular/core';
import { Locale } from '@src/helpers/enum';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private _internalActiveactiveLocale = signal<Locale>(Locale.SV);
  activeLocale = this._internalActiveactiveLocale.asReadonly();

  set(key: Locale) {
    this._internalActiveactiveLocale.set(key);
  }
}
