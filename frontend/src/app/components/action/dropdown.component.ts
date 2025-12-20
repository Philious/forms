import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, input, model, ModelSignal, signal, viewChild, viewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { array } from '@src/helpers/utils';
import { IconEnum } from '../../../helpers/enum';
import { CheckboxComponent } from './checkbox.component';

export type SelectorItem<O = unknown, I = string> = { id?: I; label: string; value: O };
export type SelectorItemWithId<O = unknown, I = string> = { id: I; label: string; value: O };

let componentIndex = 0;

@Component({
  selector: 'drop-down',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CdkConnectedOverlay,
    CheckboxComponent,
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
  ],
  template: `
    <div ngCombobox>
      <input
        class="input"
        #origin
        readonly
        base-input
        input
        [id]="uid"
        ngComboboxInput
        [value]="selectedLabel(selected())"
        [attr.readonly]="filter()"
        [disabled]="isDisabled"
      />
      <ng-template ngComboboxPopupContainer>
        <ng-template
          #menu
          [cdkConnectedOverlay]="{ origin, usePopover: 'inline', matchWidth: true }"
          [cdkConnectedOverlayOpen]="isOpen()"
          (overlayOutsideClick)="isOpen.set(false)"
          (attach)="isOpen.set(true)"
          (detach)="isOpen.set(false)"
        >
          <div class="menu" [class.multi-select]="multiSelect()" ngListbox>
            @for (item of items(); track item.id) {
              <div
                class="menu-item"
                [class.selected]="isSelected(item.id)"
                [value]="item.value"
                [label]="item.label"
                ngOption
                (click)="selectOption(item)"
              >
                @if (multiSelect()) {
                  <check-box slim [modelValue]="isSelected(item.id)" />
                }
                {{ item.label }}
              </div>
            }
          </div>
        </ng-template>
      </ng-template>
    </div>
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
export class DropdownComponent<T> {
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);
  combobox = viewChild<Combobox<string>>(Combobox);

  IconEnum = IconEnum;
  uid: string;

  filter = input<boolean>(false);
  multiSelect = input<boolean>(false);
  items = input<SelectorItemWithId<T>[]>([]);
  onlyReturnValue = input<boolean>(false);
  positions = input<ConnectedPosition[]>([
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
  ]);

  selected = model<T | SelectorItemWithId<T>[] | null>(null);
  protected selectedLabel = (selected: SelectorItemWithId<T>[] | T | null): string => {
    return Array.isArray(selected) && selected.length > 0
      ? selected.map(s => s.label).join(', ')
      : (this.items().find(item => item.id === selected)?.label ?? '');
  };

  protected isOpen = signal<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (_: SelectorItemWithId<T>[] | T | null) => {};
  private _onTouch = () => {};
  protected isDisabled: boolean = false;

  private formatReturnValue(selection: SelectorItemWithId<T>[]): typeof this.selected extends ModelSignal<infer U> ? U : T {
    const returnArray = Array.isArray(this.selected());
    if (!returnArray) return selection.length > 0 ? (selection.pop() as T) : null;

    return this.selected();
  }

  writeValue(items: SelectorItemWithId<T>[]): void {
    this.selected.set(this.formatReturnValue(items));
  }
  registerOnChange(fn: (items: SelectorItemWithId<T>[] | T | null) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  constructor() {
    this.uid = `dropdown-${componentIndex++}`;
  }

  protected toggleMenu(set?: boolean) {
    this.isOpen.update(v => (typeof set === 'boolean' ? set : !v));
  }
  protected isSelected(id: string): boolean {
    const selected = this.selected();
    if (Array.isArray(selected)) {
      return selected.map(s => s.id).includes(id);
    } else {
      return selected === id;
    }
  }
  protected selectOption(update: SelectorItemWithId<T>) {
    this.selected.update(arr => {
      if (Array.isArray(arr)) {
        if (this.multiSelect()) return array.toggle(update, arr);
        else return [update];
      } else {
        return update.value;
      }
    });

    if (!this.multiSelect()) this.isOpen.set(false);
    this._onChange(this.selected());
    this._onTouch();
  }
}
