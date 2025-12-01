import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, linkedSignal, model, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@app/app/components/action/iconButton.component';
import { SwitchComponent } from '@app/app/components/action/switch.component';
import { TextFieldComponent } from '@app/app/components/action/textfield.component';
import { ButtonStyleEnum, IconEnum } from '@app/helpers/enum';
import { Entry, EntryTypeEnum } from '@cs-forms/shared';
import { v4 as uid } from 'uuid';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconButtonComponent, TextFieldComponent, DialogModule, SwitchComponent],
  selector: 'selector-entry',
  template: `
    @let options = this.options();
    @if (options) {
      <switch [label]="'Multi select'" [(active)]="multiSelect" />

      <ul>
        @for (option of options; let idx = $index; track option.value() + idx) {
          <li class="answer-item">
            <text-field [label]="'Translation key'" [(modelValue)]="option.value" slim />
            <text-field [label]="'Translation'" [(modelValue)]="option.label" slim />
            <icon-button [icon]="IconEnum.Remove" [style]="ButtonStyleEnum.Border" (onClick)="remove(idx)" />
          </li>
        }
        <li>
          <icon-button [icon]="IconEnum.Add" [style]="ButtonStyleEnum.Border" (onClick)="add()" />
        </li>
      </ul>
    }
  `,
  styles: '',
})
export class SelectorEntryComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  props = model<Entry<EntryTypeEnum.Selector>>();

  multiSelect = signal<boolean>(!!this.props()?.multiselect);
  filterable = signal<boolean>(!!this.props()?.filterable);

  options = linkedSignal<{ label: WritableSignal<string>; value: WritableSignal<string> }[] | null>(() => {
    const props = this.props();
    return props ? props.options.map(o => ({ label: signal<string>(o.label), value: signal<string>(o.value) })) : null;
  });

  protected add() {
    this.props.update(p => {
      p?.options.push({ label: 'item-' + p.options.length, value: uid() });

      return p;
    });
  }
  protected remove(index: number) {
    this.options.update(arr => {
      if (arr && index) return arr.splice(index, 1);
      return arr;
    });
  }
}
