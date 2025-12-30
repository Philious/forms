import { Component, computed, inject, input, output } from '@angular/core';
import { LocaleService } from '@src/app/services/locale.service';
import { Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';

@Component({
  selector: 'mini-lang-tabs',
  template: `
    <div class="lang-selection">
      @for (lang of langs; track lang) {
        <button
          text-btn
          class="lang action-animation"
          [class.active]="lang.langLong === active()"
          [class.has-translation]="!!translationSet()?.[lang.langLong]"
          (click)="setActiveLang(lang.langLong)"
        >
          {{ lang.langShort }}
        </button>
      }
    </div>
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
      text-indent: 0.05em;
      letter-spacing: 0.05em;
      border: none;
      height: min-content;
      min-height: min-content;
      text-transform: uppercase;
      position: relative;
      &.active {
        background-color: var(--p-300);
        box-shadow: 0 0 0 1px var(--n-400);
      }
      &.has-translation {
        background-color: var(--n-350);

        box-shadow: 0 0 0 1px var(--p-400);
        &.active {
          background-color: var(--p-400);
          box-shadow: 0 0 0 1px var(--p-500);
        }
      }
    }
  `,
})
export class MiniLangTabsComponent {
  localeService = inject(LocaleService);
  translationSet = input<Translation>();
  activeLocale = output<Locale>();
  active = computed<Locale>(() => this.localeService.activeLocale());
  langs = Object.values(Locale).map(l => ({ langShort: l.slice(0, 2), langLong: l }));

  setActiveLang(lang: Locale) {
    this.localeService.set(lang);
    this.activeLocale.emit(lang);
  }
}
