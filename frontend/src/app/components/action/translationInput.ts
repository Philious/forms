import { Component, model, signal } from '@angular/core';
import { InputLayoutComponent } from '@app/app/components/action/input-layout/input.layout.component';
import { TranslationLocale } from '@app/assets';

@Component({
  selector: 'translation-input',
  template: `
    <input-layout slim [label]="'Question'">
      <label ngProjectAs="label">Question {{ translations()[activeLocale()] }} {{ activeLocale() }}</label>
      <input input slim [value]="translations()[activeLocale()]" (input)="updateTranslation($event.target.value, activeLocale())" />
      <div class="lang-selection" ngProjectAs="context-info">
        @for (lang of langs; track lang) {
          <button
            text-btn
            class="lang"
            [class.active]="lang.langLong === activeLocale()"
            [class.has-translation]="!!translations()[lang.langLong]"
            (click)="setActiveLang(lang.langLong)"
          >
            {{ lang.langShort }}
          </button>
        }
      </div>
    </input-layout>
  `,
  styles: `
    .lang-selection {
      display: flex;
      gap: 0.5rem;
    }
    .lang {
      line-height: 1;
      font-size: 0.625rem;
      font-weight: 600;
      background-color: var(--n-300);
      box-shadow: 0 0 0 1px var(--n-350);
      color: var(--n-800);
      padding: 0.0625rem 0.25rem;
      border-radius: 0.75rem;
      border: none;
      height: min-content;
      min-height: min-content;
      &.active {
        background-color: var(--n-350);
        box-shadow: 0 0 0 1px var(--n-400);
      }
      &.has-translation {
        background-color: var(--p-300);
        box-shadow: 0 0 0 1px var(--p-400);
        &.active {
          background-color: var(--p-400);
          box-shadow: 0 0 0 1px var(--p-500);
        }
      }
    }
  `,
  imports: [InputLayoutComponent],
})
export class TranslationInputComponent {
  activeLocale = signal<TranslationLocale>(TranslationLocale.SV_SE);
  translations = model<Record<TranslationLocale, string>>({
    [TranslationLocale.SV_SE]: '',
    [TranslationLocale.NB_NO]: '',
    [TranslationLocale.EN_US]: '',
    [TranslationLocale.SHOW_TRANSLATION_KEYS]: '',
  });

  langs = Object.values(TranslationLocale).map(l => ({ langShort: l.slice(0, 2), langLong: l }));

  setActiveLang(lang: TranslationLocale) {
    this.activeLocale.set(lang);
  }

  updateTranslation(translation: string, locale: TranslationLocale) {
    this.translations.update(t => {
      t[locale] = translation;
      return t;
    });
  }
}
