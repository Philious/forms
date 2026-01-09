import { Component, computed, input, model, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum } from '@src/helpers/enum';
import { IconComponent } from '../icons/icon.component';

let uid = 0;

@Component({
  selector: 'text-field',
  imports: [IconComponent, ReactiveFormsModule, FormsModule],
  host: {
    class: 'input-container',
    '[class]': 'type()',
    '[class.prefix]': 'prefixIcon()',
    '[class.sufix]': 'suffixIcon()',
  },
  template: `
    @let suffix = suffixIcon();
    @let prefix = prefixIcon();
    <div class="row">
      <ng-content #label>
        <label class="label" [for]="id()">{{ label() }}</label>
      </ng-content>
    </div>
    <div class="input-wrapper">
      @if (prefix) {
        <icon class="prefix" [icon]="prefix" />
      }
      <input
        class="input"
        [style.textAlign]="align()"
        [attr.aria-invalid]="ariaInvalid()"
        [(ngModel)]="modelValue"
        [attr.aria-describedby]="id()"
        [placeholder]="placeholder()"
        base-input
        input
        [id]="id()"
        [step]="step()"
        (blur)="blur()"
        [min]="min()"
        [max]="max()"
      />

      @if (suffix) {
        <icon class="sufix" [icon]="suffix" />
      }
    </div>
    @if (contextInfo()) {
      <div class="help-text">{{ contextInfo() }}</div>
    }
  `,
  styles: `
    :host {
      width: var(--input-width);
      min-width: 7rem;
      display: grid;
      gap: 0.25rem;
      font-size: var(--input-font-size);
      .input {
        font-size: inherit;
        height: var(--input-height, 2.5rem);
      }
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text {
          color: var(--error);
        }
        .input-wrapper {
          border-color: var(--error);
        }
      }
    }
    .input-wrapper {
      background-color: var(--input-bg-clr);
      box-shadow: 0 0 0 0.0625rem var(--input-border) inset;
      color: var(--input-clr);
      border-radius: 0.25rem;
      height: var(--input-height, 2.5rem);
      width: 100%;
      display: grid;

      box-sizing: border-box;
      position: relative;
      transition: border-color 0.15s;
    }
    .prefix + .input {
      padding-left: 2.5rem;
    }
    .prefix,
    .sufix {
      display: grid;
      place-content: center;
      width: 2.5rem;
      height: inherit;
    }
    .sufix {
      margin-left: auto;
    }
    .label,
    .help-text {
      &:empty {
        display: none;
      }
      color: var(--label);
      font-size: var(--txt-small);
      line-height: 1.2;
    }
    :host-context([slim]) {
      --input-height: var(--input-height-slim);
      --input-font-size: var(--input-font-size-slim);
      .prefix,
      .sufix {
        font-size: var(--txt-small);
      }
      .sufix {
        top: 0;
        right: 0;
        position: absolute;
      }
    }
  `,
})
export class TextFieldComponent<T extends number | string = string> {
  id = input(`input-${uid++}`);
  label = input<string>();
  type = input<string>('text');
  prefixIcon = input<IconEnum | null>(null);
  suffixIcon = input<IconEnum | null>(null);
  control = input<FormControl<T> | null>(null);
  placeholder = input<string>('');
  align = input<'left' | 'center' | 'right'>('left');
  step = input<number | 'any'>();
  min = input<number | null>();
  max = input<number | null>();

  blured = output<T>();

  ariaInvalid = computed(() => this.control()?.invalid && this.control()?.touched);
  modelValue = model<T>('' as T);
  contextInfo = model<string>('');

  value: string | null = null;
  disabled = false;

  blur() {
    this.blured.emit(this.modelValue());
  }
}
