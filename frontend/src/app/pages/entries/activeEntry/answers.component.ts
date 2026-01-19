import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry, EntryTypeEnum, Settings } from '@cs-forms/shared';
import { AriaDropComponent } from '@src/app/components/action/aria-drop.component';
import { TranslationInputComponent } from '@src/app/components/action/translation-input';
import { IconComponent } from '@src/app/components/icons/icon.component';
import { ButtonStyleEnum, IconEnum } from '../../../../helpers/enum';
import { answerOptions } from './answer.static';
import { BarometerComponent } from './barometer.component';

type TranslationKeyPair = { id: string; translationKey: string; translation: string; keyActive: boolean };

@Component({
  selector: 'answers',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AriaDropComponent,
    DialogModule,
    BarometerComponent,
    IconComponent,
    TranslationInputComponent,
  ],
  template: `
    @let type = this.type();
    @let entrySpecific = this.settings();

    @if (type) {
      <aria-drop class="type-selector" [label]="'Answer type'" [items]="answerOptions" [(selected)]="entryTypeArray" />

      @if (type === EntryTypeEnum.Barometer) {
        <answer-barometer [step]="0.1" [min]="2" [max]="5" />
      } @else if (type === EntryTypeEnum.Date) {
        Date
      } @else if (type === EntryTypeEnum.Number) {
        Number
      } @else if (type === EntryTypeEnum.RadioGroup || type === EntryTypeEnum.CheckboxGroup || type === EntryTypeEnum.Selector) {
        @let settings = hasOptionsKey(entrySpecific);

        <ul class="list">
          @for (pair of settings.options; track pair.label.translationKey) {
            <li class="list-item">
              <icon class="drag-icon" [icon]="IconEnum.Drag" />
              <translation-input [(translations)]="pair.label" [label]="''" />
              <button class="remove-btn icn-btn" btn slim>
                <icon [icon]="IconEnum.Remove" />
              </button>
            </li>
          }
        </ul>
        <button class="add-btn" btn slim (click)="addGroupEntry()"><icon class="add-btn-icon" [icon]="IconEnum.Add" />Add</button>
      } @else if (type === EntryTypeEnum.Text) {
        TextInput
      } @else if (type === EntryTypeEnum.Textarea) {
        Textarea
      } @else if (type === EntryTypeEnum.TextString) {}
    }
  `,
  styles: `
    .type-selector {
      display: block;
      margin-bottom: 1.5rem;
    }
    .list {
      display: grid;
      gap: 0.5rem;
    }

    .list-item {
      display: grid;
      grid-template-columns: 1.5rem auto 1.5rem;
      gap: 0.5rem;
    }

    .drag-icon,
    .remove-btn {
      font-size: 1rem;
      width: 2rem;
      height: 2rem;
      min-height: 0;
      padding: 0;
      cursor: pointer;
      display: grid;
      place-items: center;
    }
    .remove-btn {
      font-size: 1.5rem;
    }
    .add-btn {
      display: flex;
      gap: 0.25rem;
      color: var(--p-500);
      font-weight: 600;
      border-radius: 99rem;
      margin: 1rem 0 0 1.5rem;

      &:hover::before {
        background-color: currentColor;
        opacity: 0.125;
      }
      .add-btn-icon {
        font-size: 1rem;
        border-radius: 50%;
        box-shadow: 0 0 0 0.0625rem inset currentColor;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersComponent<T extends EntryTypeEnum> {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  EntryTypeEnum = EntryTypeEnum;
  answerOptions = answerOptions;

  entry = input.required<Entry<T>>();
  updatedAt = input<number>();
  update = output<Entry<T>>();

  type = computed(() => {
    this.updatedAt();
    return this.entry().type;
  });
  settings = computed(() => {
    this.updatedAt();
    return this.entry().entrySpecific;
  });
  entryTypeArray = linkedSignal<string[]>(() => {
    const type = this.entry().type;
    return type ? [type] : [];
  });

  protected hasOptionsKey(settings: Settings<T>) {
    return settings as Settings<EntryTypeEnum.CheckboxGroup | EntryTypeEnum.RadioGroup | EntryTypeEnum.Selector>;
  }

  toggle(v: boolean) {
    console.log(v.toString());
    v = !v;
    console.log(v.toString());
  }

  updateInput(event: Event, pair: TranslationKeyPair) {
    console.log(event, pair);
  }

  updateType(event: Event) {
    console.log('update', event);
  }

  addGroupEntry() {
    console.log('group entry');
  }

  removeGroupEntry(id: string) {
    console.log(id);
  }
}
