import { CommonModule } from '@angular/common';
import { Component, input, model, output, signal, viewChild } from '@angular/core';
import { Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { SignalInputLayoutComponent } from './input-layout/signal-input.layout.component';
import { MiniLangTabsComponent } from './mini-lang.component';

let id = 0;

@Component({
  selector: 'translation-input',
  template: `
    <ng-template #labelElement>
      <span>{{ label() }}</span>
      <mini-lang (activeLocale)="activeLocale.set($event)" [translationSet]="translations()" />
    </ng-template>
    <signal-input-layout
      slim
      (hasError)="hasError.emit($event)"
      [type]="'text'"
      [inputElement]="input"
      [validators]="[validator]"
      [labelElement]="labelElement"
    >
      <input
        [id]="id()"
        #input
        input
        slim
        (keydown)="updateSelectedLanguage($event)"
        class="translation-input"
        [value]="this.translations()[this.activeLocale()]"
        (input)="updateTranslation($event.target.value)"
      />
    </signal-input-layout>
  `,
  styles: `
    .input-content,
    .input-wrapper,
    .translation-input,
    .label {
      width: 100%;
    }
    .label {
      color: var(--label);
      font-size: var(--txt-small);
      grid-area: 1 / 1 / 2 / 2;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  `,
  imports: [MiniLangTabsComponent, CommonModule, SignalInputLayoutComponent],
})
export class TranslationInputComponent {
  protected input = viewChild<HTMLInputElement>('input');
  translations = model<Translation>({
    [Locale.SV]: '',
    [Locale.NB]: '',
    [Locale.EN]: '',
    [Locale.XX]: '',
  });

  id = input<string>(`translation-input-${id ? ++id : ''}`);
  label = input<string>('Translations');
  hasError = output<boolean>();

  protected activeLocale = signal<Locale & string>(Locale.XX);

  protected getTransKey = () => {
    return this.translations().translationKey;
  };

  protected validator = (_: string) => {
    const hasError = !!this.getTransKey() ? null : 'Translation key needed';
    return hasError;
  };

  protected updateTranslation(trans: string) {
    this.translations.update(obj => {
      obj[this.activeLocale()] = trans;
      return { ...obj };
    });
  }

  protected updateSelectedLanguage(event: Event) {
    const key = parseInt((event as KeyboardEvent).key);
    const ctrl = (event as KeyboardEvent).ctrlKey;
    if (ctrl && Number.isInteger(key)) {
      event.preventDefault();
    }
  }
}
