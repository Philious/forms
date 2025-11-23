import { Component, model, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry, ExtendedEntries } from '@cs-forms/shared';
import { DropdownComponent, SelectorItem } from 'src/app/components/action/dropdown.component';
import { TranslationInputComponent } from 'src/app/components/action/translationInput';
import { TranslationLocale } from '../../../../assets/index';
import { AnswersComponent } from './answers.component';
import { ConditionsComponent } from './conditions.component';
import { validatiorOptions } from './validation.static';

@Component({
  selector: 'active-entry',
  template: `
    @let entry = this.entry();
    <div>{{ entry ? '' : 'no entry' }}</div>
    @if (entry) {
      <div class="entry-section" animate.enter="'enter'" animate.leave="'leave'">
        <h2 class="h2">Active entry</h2>
        <translation-input />
      </div>

      <div class="entry-section">
        <h2 class="h2">Answers</h2>
        <answers [entry]="entry" />
      </div>
      <div class="entry-section">
        <h2 class="h2">Validation</h2>
        <drop-down [items]="validatiorOptions" [formControl]="ctrl" slim [multiSelect]="true" />
      </div>
      <div class="entry-section">
        <h2 class="h2">Conditions</h2>
        <conditions />
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
    }

    .entry-section {
      display: grid;
      padding-block: 1.5rem;
      gap: 1.5rem;
      border-bottom: 1px solid var(--n-300);
      transition:
        opacity 0.5s,
        translate 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      @starting-style {
        opacity: 0;
        translate: 0 2rem;
      }
      .enter {
        opacity: 1;
        translate: 0 0;
      }
      .leave {
        translate: 0 2rem;
      }
    }
    .row {
      gap: 0.5rem;
    }
  `,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AnswersComponent,
    ConditionsComponent,
    DropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslationInputComponent,
  ],
})
export class ActiveEntryComponent {
  entry = model<Entry | null>(null);
  validatiorOptions = validatiorOptions;
  ctrl = new FormControl<SelectorItem[]>([]);
  activeLocale = signal<TranslationLocale>(TranslationLocale.SV_SE);
  translations = signal<Record<TranslationLocale, string>>({
    [TranslationLocale.SV_SE]: '',
    [TranslationLocale.NB_NO]: '',
    [TranslationLocale.EN_US]: '',
    [TranslationLocale.SHOW_TRANSLATION_KEYS]: '',
  });
  langs = Object.values(TranslationLocale).map(l => ({ langShort: l.slice(0, 2), langLong: l }));

  setActiveLang(lang: TranslationLocale) {
    this.activeLocale.set(lang);
  }

  updateType(type: ExtendedEntries) {
    this.entry.update(e => {
      if (!e) return e;
      e.type = type;
      return e;
    });
  }
  updateTranslation(translation: string, locale: TranslationLocale) {
    console.log(translation, locale);
    this.translations.update(t => {
      t[locale] = translation;
      return t;
    });
  }
}
