import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum } from '../../../helpers/enum';
import { CustomFormControl, TextFieldMetaData } from '../../../helpers/types';
import { handleValue } from '../../../helpers/utils';
import { InputLayoutComponent } from './input.layout.component';

type Option = {
  label: string;
  value: string;
};

let index = 0;

@Component({
  selector: 'drop-down',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputLayoutComponent, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  template: `
    <input-layout class="layout" [label]="meta().label ?? ''" [sufix]="IconEnum.Down" [id]="uid">
      <input class="input" base-input input [id]="uid" [cdkMenuTriggerFor]="menu" [ngModel]="selected()" [attr.readonly]="filter()" />
    </input-layout>
    <ng-template #menu focusFirstItem>
      <div class="menu" cdkMenu>
        @for (option of options(); track option.label) {
          <button class="menu-item" cdkMenuItem (click)="control().setValue(option.value)">
            {{ option.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      min-height: 3rem;
      &.slim {
      }
    }
    .label {
      font-size: 0.75rem;
    }
    .input {
      position: absolute;
      inset: 0;
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
export class DropdownComponent implements OnInit {
  IconEnum = IconEnum;
  handleValue = handleValue;
  uid = `dropdown-${index++}`;
  menuRef = viewChild<ElementRef<HTMLInputElement> | null>('menu');
  control = input.required<CustomFormControl<TextFieldMetaData>>();

  filter = input<boolean>(false);
  options = input<Option[]>([]);
  selected = signal<string>('Nothing selected');
  meta = computed(() => this.control()?.metadata ?? {});

  ngOnInit(): void {
    this.control().valueChanges.subscribe(value => {
      this.selected.set(this.options().find(o => o.value === value)?.label ?? 'Nothing selected');
    });
  }
}
