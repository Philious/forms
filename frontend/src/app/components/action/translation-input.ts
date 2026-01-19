import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, linkedSignal, model, output, signal, viewChild } from '@angular/core';
import { Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { SignalInputLayoutComponent } from './input-layout/signal-input.layout.component';
import { MiniLangTabsComponent } from './mini-lang.component';

let id = 0;

@Component({
  selector: 'translation-input',
  template: `
    <signal-input-layout
      slim
      (hasError)="hasError.emit($event)"
      [type]="'text'"
      [inputElement]="input"
      [validators]="[validator]"
      [contextLabel]="contextLabel()"
    >
      <ng-content label>
        {{ label() }}
        @if (showTranslOptions()) {
          <mini-lang (activeLocale)="updateLocale($event)" [translationSet]="translations()" />
        }
      </ng-content>
      <input
        [id]="id()"
        #input
        input
        slim
        (keydown)="updateSelectedLanguage($event)"
        class="translation-input"
        [value]="translation()"
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
  protected input = viewChild<ElementRef<HTMLInputElement>>('input');
  translations = model<Translation>({
    [Locale.SV]: '',
    [Locale.NB]: '',
    [Locale.EN]: '',
    [Locale.XX]: '',
  });

  id = input<string>(`translation-input-${id ? ++id : ''}`);
  label = input<string>('Translations');
  contextLabel = input<string>('');
  showTranslOptions = input<boolean>(false);
  hasError = output<boolean>();

  protected activeLocale = signal<Locale & string>(Locale.XX);
  protected translation = linkedSignal(() => this.translations()[this.activeLocale()]);
  protected getTransKey = () => {
    return this.translations().translationKey;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validator = (_: string) => {
    const hasError = !!this.getTransKey() ? null : 'Translation key needed';
    return hasError;
  };

  protected updateLocale(event: Locale) {
    console.log('update: ', event, this.input());
    this.activeLocale.set(event);

    (document.activeElement as HTMLElement)?.blur();
    this.input()?.nativeElement.focus();
  }

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
