import { ChangeDetectionStrategy, Component, inject, linkedSignal, model } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Settings, Translation } from '@cs-forms/shared';
import { DropdownComponent, SelectorItem } from '@src/app/components/action/dropdown.component';
import { TranslationInputComponent } from '@src/app/components/action/translation-input';
import { LocaleService } from '@src/app/services/locale.service';
import { EntryTypeEnum } from '@src/helpers/types';
import { PartialEntry } from '../entries.page';
import { AnswersComponent } from './answers.component';
import { ConditionsComponent } from './conditions.component';
import { validatiorOptions } from './validation.static';

@Component({
  selector: 'active-entry',
  template: `
    @let entry = this.entry();
    <div>{{ entry ? '' : 'no entry' }}</div>
    @if (entry) {
      <div layout-section animate.enter="'enter'" animate.leave="'leave'">
        <h2 class="h2">Active entry</h2>
        <translation-input [translations]="entry.label" (translations)="updateTranslation($event)" />
      </div>

      <div class="layout-section">
        <h2 class="h2">Answers</h2>
        <answers [(entry)]="entry!" />
      </div>
      <div class="layout-section">
        <h2 class="h2">Validation</h2>
        <drop-down [items]="validatiorOptions" [formControl]="ctrl" slim [multiSelect]="true" />
      </div>
      <div class="layout-section">
        <h2 class="h2">Conditions</h2>
        <conditions />
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
    }

    .layout-section {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEntryComponent<T extends EntryTypeEnum> {
  localeService = inject(LocaleService);
  locale = linkedSignal(() => this.localeService.activeLocale());
  entry = model.required<PartialEntry<T>>();

  validatiorOptions = validatiorOptions;
  protected ctrl = new FormControl<SelectorItem[]>([]);

  protected type = linkedSignal<T | null>(() => this.entry().type ?? null);
  protected specificSettings = linkedSignal<Settings<T> | null>(() => this.entry()?.entrySpecific ?? null);

  protected updateTranslation(set: Event) {
    this.entry.update(e => {
      (e.label as Translation) = set as unknown as Translation;

      return e;
    });
  }
}
