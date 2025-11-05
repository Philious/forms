import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, input, model, signal, viewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { array } from 'src/helpers/utils';
import { IconEnum } from '../../../helpers/enum';
import { CheckboxComponent } from './checkbox.component';

export type SelectorItem<O = unknown> = { id: string; label: string; options?: O };

let index = 0;

@Component({
  selector: 'drop-down',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CdkConnectedOverlay, CdkMenuTrigger, CdkMenu, CdkMenuItem, CheckboxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  template: `
    <input
      class="input"
      #trigger
      readonly
      base-input
      input
      [id]="uid"
      [cdkMenuTriggerFor]="menu"
      [value]="selectedLabel(selected())"
      [attr.readonly]="filter()"
      [disabled]="isDisabled"
      (click)="toggleMenu()"
    />
    <ng-template
      #menu
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      (overlayOutsideClick)="isOpen.set(false)"
      (detach)="isOpen.set(false)"
    >
      <div class="menu" [class.multi-select]="multiSelect()" cdkMenu>
        @for (item of items(); track item.id) {
          <button class="menu-item" [class.selected]="isSelected(item.id)" cdkMenuItem (click)="selectOption(item)">
            @if (multiSelect()) {
              <check-box slim [modelValue]="isSelected(item.id)" />
            }
            {{ item.label }}
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
      .multi-select .menu-item {
        padding-left: 0.5rem;
      }
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
export class DropdownComponent<T = unknown> {
  menuRef = viewChild<ElementRef<HTMLInputElement> | null>('menu');
  IconEnum = IconEnum;
  uid: string;
  positions: ConnectedPosition[];

  filter = input<boolean>(false);
  multiSelect = input<boolean>(false);
  items = input<SelectorItem<T>[]>([]);

  selected = model<SelectorItem<T>[]>([]);
  selectedIds = model<SelectorItem['id'][]>([]);
  selectedLabel = (selected: SelectorItem<T>[]): string => {
    return selected.map(s => s.label).join(', ');
  };
  isOpen = signal<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (_: SelectorItem<T>[]) => {};
  private _onTouch = () => {};
  protected isDisabled: boolean = false;

  writeValue(items: SelectorItem<T>[]): void {
    this.selected.set(items);
  }
  registerOnChange(fn: (items: SelectorItem<T>[]) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
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

  toggleMenu() {
    this.isOpen.update(v => !v);
    console.log(this.items());
  }
  protected isSelected(id: string): boolean {
    return this.selected().filter(s => s.id === id).length > 0;
  }
  selectOption(update: SelectorItem<T>) {
    this.selected.update(arr => {
      if (this.multiSelect()) return array.toggle(update, arr);
      return [update];
    });

    this.selectedIds.set(this.selected().map(item => item.id));
    console.log(this.selectedIds());
    if (!this.multiSelect()) this.isOpen.set(false);
    this._onChange(this.selected());
    this._onTouch();
  }
}
