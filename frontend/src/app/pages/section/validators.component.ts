import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidatorsType } from 'src/helpers/types';
import { ExtendedArray, extendedArray } from 'src/helpers/utils';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { TextFieldComponent } from '../../components/action/textfield.component';
import { validatiorOptions } from './activeQuestion/validation.static';

@Component({
  selector: 'validators',
  template: `
    <div class="container">
      <h2 class="h2">Validation</h2>
      <drop-down [options]="validatiorOptions" [control]="validatorValueControl" slim [multiSelect]="true" />
      @if (hasValidator('min')) {
        <text-field [label]="'Minimum'" />
      }
      @if (hasValidator('max')) {
        <text-field [label]="'Maximum'" />
      }
      @if (hasValidator('minLength')) {
        <text-field [label]="'Minimum length'" />
      }
      @if (hasValidator('maxLength')) {
        <text-field [label]="'Maximum length'" />
      }
      @if (hasValidator('pattern')) {
        <text-field [label]="'Pattern'" />
      }
    </div>
  `,
  styles: `
    .container {
      display: grid;
      gap: 1.5rem;
    }
  `,
  imports: [CommonModule, DropdownComponent, TextFieldComponent],
})
export class validatorsComponent {
  validatiorOptions = validatiorOptions;
  validators = signal<(keyof ValidatorsType)[]>(['required']);
  validatorValueControl = new FormControl<ExtendedArray<string>>(extendedArray<string>([])) as FormControl<ExtendedArray<string>>;

  hasValidator(validator: keyof ValidatorsType) {
    return !!this.validatorValueControl.value?.includes(validator);
  }
}
