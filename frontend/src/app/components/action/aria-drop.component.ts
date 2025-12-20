import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, effect, input, model, viewChild, viewChildren } from '@angular/core';

export type OptionProps<V = unknown[]> = { value: string; data?: V; id?: string | 'auto'; disabled?: boolean; label?: string };

let idxx = 0;

@Component({
  selector: 'aria-drop',
  template: `
    <div ngCombobox readonly>
      <input #origin aria-label="Label dropdown" values="" class="input" placeholder="Select a label" ngComboboxInput [id]="id()" />
      <span class="selected-label-text">{{ displayValue() }}</span>
      <ng-template ngComboboxPopupContainer>
        <ng-template [cdkConnectedOverlay]="{ origin, usePopover: 'inline', matchWidth: true }" [cdkConnectedOverlayOpen]="true">
          <div class="menu" ngListbox [multi]="multiSelect()" [(values)]="selected">
            @for (item of items(); track item.id) {
              <div ngOption [value]="item.value" [label]="item.label" class="menu-item">
                <span class="option-check" translate="no" aria-hidden="true"> x </span>
                <span class="option-text">{{ item.value }}</span>
              </div>
            }
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center start;
      padding: 0 2rem 0 1rem;
    }
    .selected-label-text {
    }
    .input {
      cursor: pointer;
      position: absolute;
      inset: 0;
      padding-inline: 1rem 1rem;
    }
    .menu {
      display: grid;
      width: 100%;

      background-color: var(--n-300);
      gap: 0.0625rem;
      border-radius: 0.25rem;
      overflow-y: auto;
      box-sizing: border-box;
      box-shadow:
        0 1px 2px hsla(0, 0%, 0%, 0.32),
        0 2px 4px hsla(0, 0%, 0%, 0.24),
        0 4px 8px hsla(0, 0%, 0%, 0.16),
        0 8px 16px hsla(0, 0%, 0%, 0.08);
      &.multi-select .menu-item {
        padding-left: 0.5rem;
      }
      .menu-item {
        box-sizing: border-box;
        padding: 0.5rem 1.5rem;
        width: 100%;
        text-align: left;
        background-color: var(--n-300);
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        &:hover {
          background-color: hsla(0, 0%, 100%, 0.1);
        }
        border: none;
      }
    }
    [ngCombobox]:has([ngComboboxInput][aria-expanded='false']) .menu {
      max-height: 0;
      opacity: 0;
      visibility: hidden;
      transition:
        max-height 150ms ease-in,
        visibility 0s 150ms,
        opacity 150ms ease-in;
    }
    [ngComboboxInput] {
      opacity: 0;
      cursor: pointer;
      padding: 0 2.5rem;
      height: 2.5rem;
      border: none;
    }
    [ngListbox] {
      gap: 2px;
      height: 100%;
      display: flex;
      overflow: auto;
      flex-direction: column;
    }
    [ngOption][data-active='true'] {
      outline-offset: -2px;
      outline: 2px solid color-mix(in srgb, var(--primary) 50%, transparent);
    }
    [ngOption][aria-selected='true'] {
      color: var(--hot-pink);
      background-color: color-mix(in srgb, var(--primary) 5%, transparent);
    }
    [ngOption]:not([aria-selected='true']) .option-check {
      display: none;
    }
  `,
  imports: [Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, Listbox, Option, CommonModule, CdkConnectedOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AriaDropComponent<V> {
  combobox = viewChild<Combobox<string>>(Combobox);
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);

  id = input<string>(`aria-drop${++idxx}`);
  items = input<OptionProps<V>[]>([]);
  multiSelect = input<boolean>(false);
  selected = model<string[]>([]);

  displayValue = computed(() => {
    const selected = this.selected();
    return selected.length === 0 ? 'None selected' : selected.length === 1 ? selected[0] : `${selected[0]} + ${selected.length - 1} more`;
  });

  constructor() {
    afterRenderEffect(() => {
      const option = this.options().find(opt => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });
    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
    effect(() => {
      console.log(this.selected());
    });
  }
}
