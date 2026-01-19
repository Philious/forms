import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, effect, input, model, viewChild, viewChildren } from '@angular/core';
import { SignalInputLayoutComponent } from '@app/components/action/input-layout/signal-input.layout.component';
import { IconEnum } from '@src/helpers/enum';
import { Validator } from './input-layout/input.types';

export type OptionProps<T = unknown> = { label: () => string; value: string; disabled?: boolean; data?: T };

let id = 0;

@Component({
  selector: 'aria-drop',
  template: `
    <signal-input-layout
      [type]="'text'"
      slim
      [label]="label()"
      [sufix]="IconEnum.Down"
      [contextLabel]="contextLabel()"
      [validators]="validators()"
      [writeValue]="selected().join('')"
      ngCombobox
      readonly
    >
      <input #origin aria-label="selector" values="" class="input" placeholder="Select..." ngComboboxInput [id]="id()" />
      <div class="selected-label-text">{{ displayValue() }}</div>

      <ng-template ngComboboxPopupContainer>
        <ng-template [cdkConnectedOverlay]="{ origin, usePopover: 'inline', matchWidth: true }" [cdkConnectedOverlayOpen]="true">
          <div class="list">
            <div class="menu" ngListbox [multi]="multi()" [(values)]="selected" [class.multi]="multi()">
              @for (item of items(); track item.value) {
                <div ngOption [value]="item.value" [label]="item.label()" class="menu-item">
                  @if (multi()) {
                    <svg class="option-check" translate="no" aria-hidden="true"><path class="option-path" /></svg>
                  }
                  <span class="option-text">{{ item.label() }} </span>
                </div>
              }
            </div>
          </div>
        </ng-template>
      </ng-template>
    </signal-input-layout>
  `,
  styles: `
    .selected-label-text {
      font-size: var(--input-font-size);
      font-weight: 600;
      width: inherit;
      height: inherit;
      display: flex;
      align-items: center;
      padding: 0 var(--input-padding);
    }
    .input {
      cursor: pointer;
      position: absolute;
      inset: 0;
      padding: 0 calc(var(--input-padding) + 2rem) 0 var(--input-padding);
    }
    .list {
    }
    .menu {
      font-size: var(--txt-mid);
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
      height: inherit;
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
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    CommonModule,
    SignalInputLayoutComponent,
    CdkConnectedOverlay,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AriaDropComponent {
  IconEnum = IconEnum;
  combobox = viewChild<Combobox<string>>(Combobox);
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);

  id = input<string>(`aria-drop${++id}`);
  label = input<string>('');
  validators = input<Validator[]>([]);
  contextLabel = input<string>('');

  items = input.required<OptionProps[]>();
  multi = input<boolean>(false);

  selected = model.required<string[]>();

  displayValue = computed(() => {
    const options = this.items();
    const selected = options.filter(o => this.selected().includes(o.value)).map(o => o.label());

    return selected.length === 0 ? 'None selected' : selected.length === 1 ? selected[0] : `${selected[0]} + ${selected.length - 1} more`;
  });

  constructor() {
    effect(() => console.log(this.selected()));
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
