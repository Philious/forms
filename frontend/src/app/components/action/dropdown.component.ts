import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { extendedArray, ExtendedArray } from 'src/helpers/utils';
import { IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { CheckboxComponent } from './checkbox.component';
import { InputLayoutComponent } from './input.layout.component';

let index = 0;

@Component({
  selector: 'drop-down',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputLayoutComponent,
    CdkConnectedOverlay,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CheckboxComponent,
  ],
  template: `
    <input-layout class="layout" [label]="label()" [sufix]="IconEnum.Down" [id]="uid">
      <input
        class="input"
        #trigger
        readonly
        base-input
        input
        [id]="uid"
        [cdkMenuTriggerFor]="menu"
        [value]="selectedLabel()"
        [attr.readonly]="filter()"
        (click)="toggleMenu()"
      />
    </input-layout>
    <ng-template
      #menu
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      (overlayOutsideClick)="isOpen.set(false)"
      (detach)="isOpen.set(false)"
    >
      <div class="menu" cdkMenu>
        @for (option of options(); track option.label) {
          <button class="menu-item" cdkMenuItem (click)="toggleOption($event, option)">
            @if (multiSelect()) {
              <check-box slim [modelValue]="!!this.control().value?.includes(option.value)" />
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
      display: flex;
      align-items: center;
      gap: 0.6rem;
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
    .menu.multi-select .menu-item {
      padding-left: 0.5rem;
    }
  `,
})
export class DropdownComponent<T extends boolean, V> implements OnInit {
  menuRef = viewChild<ElementRef<HTMLInputElement> | null>('menu');
  IconEnum = IconEnum;
  uid: string;
  positions: ConnectedPosition[];

  control = input.required<FormControl<ExtendedArray<V> | null>>();

  label = input<string>('');
  filter = input<boolean>(false);
  options = input<Option<V>[] | null>([]);
  multiSelect = input<T>(false as T);

  isOpen = signal<boolean>(false);

  selectedLabel = signal<string | null>(null);

  updateLabel() {
    const selected = this.control()?.value;

    if (!selected) return;
    this.selectedLabel.set(
      this.options()
        ?.filter(o => selected?.includes(o.value))
        .map(o => o.label)
        .join(', ') ?? null
    );
  }

  constructor() {
    this.uid = `dropdown-${index++}`;
    this.positions = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
    ];
  }

  ngOnInit(): void {
    this.updateLabel();
  }

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  toggleOption(event: MouseEvent, update: Option<V>) {
    if (this.multiSelect()) {
      this.control().setValue(this.control().value?.toggle(update.value) ?? null);
    } else {
      this.control().setValue(extendedArray([update.value]));
      this.toggleMenu();
    }
    this.control().markAsDirty();
    this.control().markAllAsTouched();
    this.updateLabel();
  }
}
