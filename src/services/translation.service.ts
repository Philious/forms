import { computed, Injectable, signal } from "@angular/core";
import { Language } from "../helpers/enum";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _showTranslations = signal<boolean>(false);
  private _currentTranslation = signal<Language>(Language.Swedish);

  showTranslations = computed(() => this._showTranslations());
  currentTranslation = computed(() => this._currentTranslation())

  updateShowTranslations(update: boolean): void { this._showTranslations.update(() => update) }
  updateCurrentTranslation(update: Language): void { this._currentTranslation.update(() => update) }
}