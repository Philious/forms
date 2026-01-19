import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Condition, Entry, ExtendedCondition, Settings } from '@cs-forms/shared';
import { AriaDropComponent } from '@src/app/components/action/aria-drop.component';
import { TranslationInputComponent } from '@src/app/components/action/translation-input';
import { LocaleService } from '@src/app/services/locale.service';
import { Translation } from '@src/helpers/translationTypes';
import { EntryTypeEnum } from '@src/helpers/types';
import { KeyMap } from './answer.static';
import { AnswersComponent } from './answers.component';
import { ConditionsComponent } from './conditions.component';

@Component({
  selector: 'active-entry',
  template: `
    @let label = this.label();
    @if (label) {
      <div class="layout-section" animate.enter="'enter'" animate.leave="'leave'">
        <h2 class="h2">Active entry</h2>
        <translation-input [translations]="label" (translationsChange)="update('label', $event)" />
      </div>
    }
    <div class="layout-section">
      <h2 class="h2">Answers</h2>
      <answers [entry]="entry()" [updatedAt]="updatedAt()" (update)="updateEntry.emit($event)" />
    </div>
    <div class="layout-section">
      <h2 class="h2">Validation</h2>
      <!--
          <aria-drop [items]="validatiorOptions" [(selected)]="selectedValidation" slim [multi]="true" />
        -->
    </div>
    <div class="layout-section">
      <h2 class="h2">Conditions</h2>
      <conditions />
    </div>
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
      &:first-child {
        padding-top: 0;
      }
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
    AriaDropComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslationInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEntryComponent<T extends EntryTypeEnum> {
  localeService = inject(LocaleService);

  entry = input.required<Entry<T>>();
  updatedAt = input<number>();

  updateEntry = output<Entry>();

  protected label = computed<Translation>(() => {
    this.updatedAt();

    return this.entry().label;
  });

  protected settings = computed<Settings<T>>(() => {
    this.updatedAt();

    return this.entry().entrySpecific;
  });

  protected validation = computed(() => {
    this.updatedAt();

    return this.entry().validation ?? null;
  });

  protected condition = computed<Condition | ExtendedCondition | null>(() => {
    this.updatedAt();

    return this.entry().condition ?? null;
  });

  locale = linkedSignal(() => this.localeService.activeLocale());

  protected selectedValidation = signal<string[]>([]);

  protected update<E extends KeyMap<Entry<T>>>(updateKey: keyof E, value: E[keyof E]) {
    this.updateEntry.emit({
      ...this.entry(),
      ...{ [updateKey]: value },
      updated: new Date().valueOf(),
    });
  }
}
