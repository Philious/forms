import { Component, computed, input, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl } from '../../../helpers/types';
import { handleValue } from '../../../helpers/utils';
import { IconComponent } from '../icons/icon.component';

let uid = 0;

@Component({
  selector: 'text-field',
  imports: [IconComponent, ReactiveFormsModule, FormsModule],
  host: {
    class: 'input-container',
    '[class]': 'meta()?.type',
    '[class.prefix]': 'meta()?.prefix',
    '[class.sufix]': 'meta()?.sufix',
  },
  template: `
    @let label = meta().label; @let prefixVar = meta().prefix; @let sufixVar =
    meta().sufix; @let helpVar = helpText();
    <label class="label" [for]="id()">{{ label }}</label>
    <div class="input-wrapper">
      @if (prefixVar) {
      <icon class="prefix" [icon]="prefixVar" />
      }
      <input
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-describedby]="id() + '-error'"
        base-input
        input
        [id]="id()"
        [formControl]="control()"
      />
      @if (sufixVar) {
      <icon class="sufix" [icon]="sufixVar" />
      }
    </div>
    @if (helpVar) {
    <div class="help-text">{{ helpVar }}</div>
    }
  `,
  styles: `
    :host {
      width: var(--input-width);
      min-width: 7rem;
      display: grid;
      gap: .25rem; 
      [slim] {
        .input-wrapper {
          height: 2rem;
        }
      }
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text { color: var(--error); }
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
      transition: border-color .15s;
    }
    .prefix,
    .sufix {
      display: grid;
      place-content: center;
      width: 2.5rem;
      height: inherit;
    }
    .sufix {margin-left: auto; }
    .label,
    .help-text {
      &:empty { display: none; }
      color: var(--label);
      font-size: var(--txt-small);
      line-height: 1.2;
    }
      
    
  `,
})
export class TextFieldComponent {
  handleValue = handleValue;
  id = input(`input-${uid++}`);
  control = input.required<CustomFormControl>();
  meta = computed(() => this.control()?.metadata);
  ariaInvalid = computed(
    () => this.control().invalid && this.control().touched
  );
  helpText = model<string>('');

  value: string | null = null;
  disabled = false;
}
