import { Component, computed, inject, input, output } from '@angular/core';
import { LocaleService } from '@src/app/services/locale.service';
import { ButtonStyleEnum, Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { ContextMenuComponent } from '../modals/contextMenu.component';

@Component({
  selector: 'mini-lang',
  template: `
    @if (menuSelector()) {
      <context-menu [options]="langs" (updateSelected)="setActiveLang($event)">
        <div #trigger class="trigger">{{ active().slice(0, 2) }}</div>
      </context-menu>
    } @else {
      <div class="lang-selection">
        @for (lang of langs; track lang) {
          <button
            text-btn
            class="lang action-animation"
            [class.active]="lang.value === active()"
            [class.has-translation]="!!translationSet()?.[lang.value]"
            (click)="setActiveLang(lang.value)"
          >
            {{ lang.label }}
          </button>
        }
      </div>
    }
  `,
  styles: `
    .trigger {
      display: grid;
      place-items: center;
      font-size: 1.125rem;
      line-height: 1;
      font-weight: 500;
      width: 3rem;
      height: 3rem;
    }
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
  imports: [ContextMenuComponent],
})
export class MiniLangTabsComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  localeService = inject(LocaleService);
  translationSet = input<Translation>();
  menuSelector = input<boolean>(false);

  activeLocale = output<Locale>();
  active = computed<Locale>(() => this.localeService.activeLocale());
  langs = Object.values(Locale).map(l => ({ label: l.slice(0, 2), value: l }));

  setActiveLang(lang: Locale) {
    this.localeService.set(lang);
    this.activeLocale.emit(lang);
  }
}
