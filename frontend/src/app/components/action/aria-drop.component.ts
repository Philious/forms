import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, model, viewChild, viewChildren } from '@angular/core';

export type OptionProps<T = unknown> = { label: () => string; value: string; disabled?: boolean; data?: T };

let id = 0;

@Component({
  selector: 'aria-drop',
  template: `
    <div ngCombobox readonly>
      <input #origin aria-label="selector" values="" class="input" placeholder="Select..." ngComboboxInput [id]="id()" />
      <span class="selected-label-text">{{ displayValue() }}</span>
      <ng-template ngComboboxPopupContainer>
        <ng-template [cdkConnectedOverlay]="{ origin, usePopover: 'inline', matchWidth: true }" [cdkConnectedOverlayOpen]="true">
          <div>
            <div class="menu" ngListbox [multi]="multi()" [(values)]="selected" [class.multi]="multi()">
              @for (item of items(); track item.value) {
                <div ngOption [value]="item.value" [label]="item.label()" class="menu-item">
                  @if (multi()) {
                    <svg class="option-check" translate="no" aria-hidden="true"><path class="option-path" /></svg>
                  }
                  <span class="option-text">{{ item.label() }}</span>
                </div>
              }
            </div>
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
      font-size: 0.875rem;
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
        border: none;
        &:hover {
          background-color: hsla(0, 0%, 100%, 0.1);
        }
        &:not(.disabled) {
          cursor: pointer;
        }
      }
      &.multi .menu-item {
        padding-left: 0.75rem;
      }
      &:not(.multi) .option-check {
        display: none;
      }
    }

    .option-check {
      width: 1rem;
      height: 1rem;
      pointer-events: none;
    }
    .option-path {
      transition:
        d 0.25s,
        opacity 0.25s;
      fill: transparent;
      stroke: light-dark(var(--p-200), #fff);
      stroke-width: 1.5;
      d: path('M8 8, 8 8, 8 8');
    }
    [disable] {
      background-color: light-dark(#00000011, #ffffff11);
      .input {
        pointer-events: none;
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
      border-radius: 0.25rem;
      outline: 2px solid color-mix(in srgb, var(--white) 50%, transparent);
      background-color: color-mix(in srgb, var(--primary) 5%, transparent);
    }
    [ngOption][aria-selected='true'] .option-path {
      transition:
        d 0.25s,
        opacity 0 0 box-shadow 3.25s;
      opacity: 1;
      d: path('M2 8, 6 12, 14 4');
    }
    [ngOption]:not([aria-selected='true']) .option-check {
      // display: none;
    }
  `,
  imports: [Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, Listbox, Option, CommonModule, CdkConnectedOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AriaDropComponent {
  combobox = viewChild<Combobox<string>>(Combobox);
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);

  id = input<string>(`aria-drop${++id}`);
  items = input.required<OptionProps[]>();
  multi = input<boolean>(false);

  selected = model.required<string[]>();

  displayValue = computed(() => {
    const options = this.items();
    const selected = options.filter(o => this.selected().includes(o.value)).map(o => o.label());

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
  }
}
