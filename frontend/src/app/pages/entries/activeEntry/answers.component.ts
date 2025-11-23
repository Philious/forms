import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, model, ModelSignal, Pipe, PipeTransform, signal } from '@angular/core';
import { FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry, EntryTypeEnum } from '@cs-forms/shared';
import { InputLayoutComponent } from 'src/app/components/action/input-layout/input.layout.component';
import { TranslationInputComponent } from 'src/app/components/action/translationInput';
import { IconComponent } from 'src/app/components/icons/icon.component';
import { v4 as uid } from 'uuid';
import { ButtonStyleEnum, IconEnum } from '../../../../helpers/enum';
import { DropdownComponent, SelectorItem } from '../../../components/action/dropdown.component';
import { BarometerComponent } from './barometer.component';
import { SelectorEntryComponent } from './selectorEntry.component';

@Pipe({
  name: 'toggle',
})
export class Toggle implements PipeTransform {
  transform(value: boolean): boolean {
    return !value;
  }
}

type TranslationKeyPair = { id: string; translationKey: string; translation: string; keyActive: boolean };

@Component({
  selector: 'answers',
  host: {
    list: '',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownComponent,
    DialogModule,
    BarometerComponent,
    InputLayoutComponent,
    SelectorEntryComponent,
    IconComponent,
    TranslationInputComponent,
  ],
  template: `
    <span>
      <input-layout slim [label]="'Answer type'" [sufix]="IconEnum.Down">
        <drop-down [items]="typeOptions" [selectedIds]="selectedEntryType()" (selectedIds)="updateType($event)" />
      </input-layout>
    </span>
    @if (entry().type === EntryTypeEnum.Barometer) {
      <answer-barometer [step]="0.1" [min]="2" [max]="5" />
    } @else if (entry().type === EntryTypeEnum.Date) {
      Date
    } @else if (entry().type === EntryTypeEnum.Number) {
      Number
    } @else if (entry().type === EntryTypeEnum.RadioGroup || entry().type === EntryTypeEnum.CheckboxGroup) {
      <ul class="list">
        @for (pair of groupValues(); track pair.id) {
          <li class="trans-trans-key">
            <icon class="drag-icon" [icon]="IconEnum.Drag" />
            <translation-input />
            <button class="remove-btn icn-btn" btn slim (click)="removeGroupEntry(pair.id)">
              <icon [icon]="IconEnum.Remove" />
            </button>
          </li>
        }
      </ul>
      <button class="add-btn" btn slim (click)="addGroupEntry()"><icon [icon]="IconEnum.Add" />Add</button>
    } @else if (entry().type === EntryTypeEnum.Selector) {
      @let entry = typeHelper(this.entry, EntryTypeEnum.Selector);
      <selector-entry [(props)]="entry" />
    } @else if (entry().type === EntryTypeEnum.Text) {
      TextInput
    } @else if (entry().type === EntryTypeEnum.Textarea) {
      Textarea
    } @else if (entry().type === EntryTypeEnum.TextString) {}
  `,
  styles: `
    .answer-list:empty {
      display: none;
    }

    .toggle-state-icon {
      width: 1.5rem;
      stroke: var(--n-500);
      .linear {
      }
      .inverse-linear {
      }
    }

    .list {
      display: grid;
      gap: 1.5rem;
    }

    .drag-icon {
      cursor: pointer;
      height: 1.5rem;
      margin-top: 1.5rem;
    }

    .list-item {
      display: grid;
      grid-template-columns: min-content auto;
      gap: 1rem;
    }
    .remove-btn {
      width: 2rem;
      height: 2rem;
      padding: 0;
      margin-top: 1.125rem;
    }
    .add-btn {
      padding-left: 0;
      &:hover::before {
        background-color: var(--hover-clr);
        border-radius: 0.25rem;
      }
    }
    .trans-trans-key {
      display: grid;
      grid-template-columns: 1.5rem auto 1.5rem;
      gap: 0.5rem;
    }
    .toggling-label {
      display: grid;
      align-items: center;
      gap: 1rem;
      grid-template-columns: 1fr auto 1rem;
    }
    .toggle-btn {
      display: grid;
      place-items: center;
      height: 1rem;
      min-height: 1rem;
      width: 1rem;
      padding: 0;
      translate: -0.125rem 0.0625rem;
      .toggle-icon {
        translate: -18% -18%;
      }
      &:before {
        inset: -0.25rem;
      }
    }
  `,
})
export class AnswersComponent<T extends EntryTypeEnum> {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  EntryTypeEnum = EntryTypeEnum;

  entry = model.required<Entry>();
  selectedEntryType = signal<T[]>([EntryTypeEnum.RadioGroup] as T[]);

  typeHelper<T extends EntryTypeEnum>(entry: ModelSignal<Entry>, _: T) {
    return entry as unknown as ModelSignal<Entry<T>>;
  }

  groupValues = signal<TranslationKeyPair[]>([]);

  typeOptions: SelectorItem[] = [
    { id: EntryTypeEnum.Barometer, label: 'Barometer' },
    { id: EntryTypeEnum.CheckboxGroup, label: 'Checkgroup' },
    { id: EntryTypeEnum.Date, label: 'Date field' },
    { id: EntryTypeEnum.Number, label: 'Number field' },
    { id: EntryTypeEnum.RadioGroup, label: 'Radiogroup' },
    { id: EntryTypeEnum.Selector, label: 'Selector' },
    { id: EntryTypeEnum.Text, label: 'Text field' },
    { id: EntryTypeEnum.Textarea, label: 'Textarea field' },
    { id: EntryTypeEnum.TextString, label: 'Text' },
  ];

  formRecord = new FormRecord({});
  toggle(v: boolean) {
    console.log(v.toString());
    v = !v;
    console.log(v.toString());
  }

  updateInput(event: Event, pair: TranslationKeyPair) {
    const value = (event.target as HTMLInputElement).value;
    this.groupValues.update(g => {
      const idx = g.findIndex(p => p.id === pair.id);
      g[idx][pair.keyActive ? 'translationKey' : 'translation'] = pair.keyActive ? value.replace(/\s/g, '.') : value;
      return g;
    });
  }

  updateType(event: Event) {
    this.entry.update(e => {
      e.type = (event as unknown as string[]).at(0) as EntryTypeEnum;

      return e;
    });
  }

  addGroupEntry() {
    this.groupValues.update(group => {
      group.push({ id: uid(), translationKey: '', translation: '', keyActive: true });

      return group;
    });
  }

  removeGroupEntry(id: string) {
    this.groupValues.update(group => group.filter(g => g.id !== id));
  }
}
