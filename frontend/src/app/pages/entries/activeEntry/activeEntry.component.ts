import { Component, model } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry, EntryId, ExtendedEntries } from '@cs-forms/shared';
import { DropdownComponent, SelectorItem } from 'src/app/components/action/dropdown.component';
import { TextFieldComponent } from 'src/app/components/action/textfield.component';
import { AnswersComponent } from './answers.component';
import { ConditionsComponent } from './conditions.component';
import { validatiorOptions } from './validation.static';

@Component({
  selector: 'active-entry',
  template: `
    @let entry = this.entry();
    <div>{{ entry ?? 'no entry' }}</div>
    @if (entry) {
      <div class="entry-section" animate.enter="'enter'" animate.leave="'leave'">
        <h2 class="h2">Active entry</h2>
        <text-field slim [label]="'Translation key'" [modelValue]="entry.id" (modelValueChange)="updateId($event)"> </text-field>
        <text-field slim [label]="'Question'" [modelValue]="entry.label" (modelValueChange)="updateLabel($event)" />
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
    .row {
      display: grid;
      grid-template-columns: 1fr 4fr;
      align-items: end;
      gap: 1.5rem;
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
  `,
  imports: [ReactiveFormsModule, FormsModule, AnswersComponent, ConditionsComponent, TextFieldComponent, DropdownComponent],
})
export class ActiveEntryComponent {
  entry = model<Entry | null>(null);
  validatiorOptions = validatiorOptions;
  ctrl = new FormControl<SelectorItem[]>([]);

  updateId(id: EntryId) {
    this.entry.update(e => {
      if (!e) return e;
      e.id = id;
      return e;
    });
  }
  updateType(type: ExtendedEntries) {
    this.entry.update(e => {
      if (!e) return e;
      e.type = type;
      return e;
    });
  }
  updateLabel(label: string) {
    this.entry.update(e => {
      if (!e) return e;
      e.label = label;
      return e;
    });
  }
}
