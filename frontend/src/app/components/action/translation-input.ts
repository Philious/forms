import { Component, input, model, signal, viewChild } from '@angular/core';
import { ControlInputLayoutComponent } from '@src/app/components/action/input-layout/controls-input.layout.component';
import { Locale } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { MiniLangTabsComponent } from './mini-lang-tabs.component';

let id = 0;

@Component({
  selector: 'translation-input',
  template: `
    <control-input-layout slim>
      <input
        [id]="id()"
        #input
        ngProjectAs="input"
        input
        slim
        (keydown)="updateLanguage($event)"
        class="translation-input"
        [value]="translations()[activeLocale()]"
        (input)="updateTranslation($event.target.value)"
      />

      <label [for]="id()" class="label" ngProjectAs="context-info">
        <span>{{ label() }}</span>
        <mini-lang-tabs (activeLocale)="activeLocale.set($event)" [translationSet]="translations()" />
      </label>
    </control-input-layout>
  `,
  styles: `
    .input-content,
    .input-wrapper,
    .translation-input,
    .label {
      width: 100%;
    }
    .label {
      grid-area: 1 / 1 / 2 / 2;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  `,
  imports: [ControlInputLayoutComponent, MiniLangTabsComponent],
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
  activeLocale = signal<Locale>(Locale.SV);

  updateTranslation(trans: string) {
    this.translations.update(obj => {
      obj[this.activeLocale()] = trans;
      return obj;
    });
  }
  updateLanguage(event: Event) {
    const key = parseInt((event as KeyboardEvent).key);
    const ctrl = (event as KeyboardEvent).ctrlKey;
    if (ctrl && Number.isInteger(key)) {
      event.preventDefault();
      console.log(key);
      console.log(this.input());
    }
  }
  constructor() {
    console.log(this.translations());
  }
}
