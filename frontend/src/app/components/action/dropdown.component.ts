import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, model, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { InputLayoutComponent } from './input.layout.component';

let index = 0;

@Component({
  selector: 'drop-down',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputLayoutComponent, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  template: `
    <input-layout class="layout" [label]="label()" [sufix]="IconEnum.Down" [id]="uid">
      <input
        class="input"
        readonly
        base-input
        input
        [id]="uid"
        [cdkMenuTriggerFor]="menu"
        [value]="modelValue()?.label ?? 'Nothing selected'"
        [attr.readonly]="filter()"
      />
    </input-layout>
    <ng-template #menu focusFirstItem>
      <div class="menu" cdkMenu>
        @for (option of options(); track option.label) {
          <button class="menu-item" cdkMenuItem (click)="setOption(option.value)">
            {{ option.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
  styles: `
    :host:not([slim]) {
      min-height: 3rem;
      .input {
        padding-inline: 1rem 3rem;
      }
    }
    .label {
      font-size: 0.75rem;
    }
    .input {
      cursor: pointer;
      position: absolute;
      inset: 0;
      padding-inline: 1rem 1.5rem;
    }
    .icon {
      margin-left: auto;
      justify-self: flex-end;
    }
    .menu {
      display: grid;
      background-color: var(--n-300);
      gap: 0.0625rem;
      border-radius: 0.25rem;
      overflow-y: auto;
    }
    .menu-item {
      padding: 1rem 1.5rem;
      background-color: var(--n-200);
      border: none;
    }
  `,
})
export class DropdownComponent {
  IconEnum = IconEnum;
  uid = `dropdown-${index++}`;

  menuRef = viewChild<ElementRef<HTMLInputElement> | null>('menu');

  control = input<FormControl>();
  label = input<string>('');
  filter = input<boolean>(false);
  options = input<Option[] | null>([]);

  modelValue = model<Option | null>(null);

  setOption(update: string) {
    this.control()?.setValue(update);
    this.modelValue.set(this.options()?.find(o => o.value === update) ?? null);
  }
}
