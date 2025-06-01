import { Component, computed, input, model, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum } from 'src/helpers/enum';
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
    <label class="label" [for]="id()">{{ label() }}</label>
    <div class="input-wrapper">
      @if (prefix) {
        <icon class="prefix" [icon]="prefix" />
      }
      <input
        class="input"
        [attr.aria-invalid]="ariaInvalid()"
        [(ngModel)]="modelValue"
        [attr.aria-describedby]="id()"
        base-input
        input
        [id]="id()"
        (blur)="blur()"
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
      [slim] {
        .input-wrapper {
          height: 2rem;
          padding-inline: 0.5rem;
        }
        .input {
          padding-inline: 0.5rem;
        }
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
      border-radius: 0.125rem;
      height: 2.5rem;
      width: 100%;
      display: grid;

      box-sizing: border-box;
      position: relative;
      transition: border-color 0.15s;
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
  `,
})
export class TextFieldComponent {
  id = input(`input-${uid++}`);
  label = input<string>();
  type = input<string>('text');
  prefixIcon = input<IconEnum | null>(null);
  suffixIcon = input<IconEnum | null>(null);
  control = input<FormControl | null>(null);
  blured = output<string | null>();

  ariaInvalid = computed(() => this.control()?.invalid && this.control()?.touched);
  modelValue = model<string>('');
  contextInfo = model<string>('');

  value: string | null = null;
  disabled = false;

  blur() {
    this.blured.emit(this.modelValue());
  }
}
