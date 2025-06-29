import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, model, ModelSignal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { CheckboxComponent } from './checkbox.component';
import { InputLayoutComponent } from './input.layout.component';

let index = 0;

@Component({
  selector: 'drop-down',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputLayoutComponent, CdkMenuTrigger, CdkMenu, CdkMenuItem, CheckboxComponent],
  template: `
    <input-layout class="layout" [label]="label()" [sufix]="IconEnum.Down" [id]="uid">
      <input class="input" readonly base-input input [id]="uid" [cdkMenuTriggerFor]="menu" [value]="selectedLabel()" [attr.readonly]="filter()" />
    </input-layout>
    <ng-template #menu focusFirstItem>
      <div class="menu" cdkMenu>
        @for (option of options(); track option.label) {
          <button class="menu-item" cdkMenuItem (click)="setOption(option)">
            @if (multiSelect()) {
              <check-box [(modelValue)]="check" (modelValueChange)="checkChange($event)" />
            }
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
      padding-inline: 1rem 1rem;
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
      box-shadow:
        0 1px 2px hsla(0, 0%, 0%, 0.32),
        0 2px 4px hsla(0, 0%, 0%, 0.24),
        0 4px 8px hsla(0, 0%, 0%, 0.16),
        0 8px 16px hsla(0, 0%, 0%, 0.08);
    }
    .menu-item {
      padding: 0.5rem 1.5rem;
      width: 100%;
      text-align: left;
      background-color: var(--n-300);
      position: relative;
      &:before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: transparent;
      }
      &:hover {
        background-color: hsla(0, 0%, 100%, 0.1);
      }
      border: none;
    }
  `,
})
export class DropdownComponent<T extends boolean> {
  IconEnum = IconEnum;
  uid = `dropdown-${index++}`;

  menuRef = viewChild<ElementRef<HTMLInputElement> | null>('menu');

  control = input<FormControl>();
  label = input<string>('');
  filter = input<boolean>(false);

  options = input<Option[] | null>([]);

  multiSelect = input<T>(false as T);
  check = model<boolean>(false);
  modelValue = model<(T extends true ? Option[] : Option) | null>(null);

  selectedLabel = computed<string>(() => {
    const value = this.modelValue();
    return (
      (Array.isArray(value)
        ? value.reduce((acc, v, idx) => {
            acc = acc + (idx === 0 ? v : ', ' + v);
            return acc;
          }, '')
        : value?.label) ?? 'Nothing selected'
    );
  });

  checkChange(state: boolean) {
    console.log(state);
  }

  isSelected(val: Option): boolean {
    const selected = this.modelValue();
    return Array.isArray(selected) ? !!selected.find(o => o.value === val.value) : false;
  }
  setOption(update: Option) {
    this.control()?.setValue(update);
    const multiSelect = this.multiSelect();
    if (multiSelect)
      (this.modelValue as ModelSignal<Option[] | null>).update(value => {
        if (!value) return null;
        else {
          const index = value.findIndex(v => v.value === update.value) ?? 1;
          return index < 0 ? [...(value ?? []), update] : ((value?.splice(index, 1) ?? null) as Option[] | null);
        }
      });
    else {
      (this.modelValue as ModelSignal<Option | null>).update(() => update);
    }
  }
}
