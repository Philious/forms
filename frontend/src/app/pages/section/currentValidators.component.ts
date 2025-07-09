import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';
import { ValidatorsType } from 'src/helpers/types';
import { Option } from '../../../helpers/types';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { TextFieldComponent } from '../../components/action/textfield.component';
import { validatiorOptions } from './static';

@Component({
  selector: 'current-validators',
  template: `
    <div class="container">
      <h2 class="h2">Validation</h2>
      <drop-down [options]="validatiorOptions" [(modelValue)]="validators" [multiSelect]="true" (modelValueChange)="updateValidators($event)" />
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
export class CurrentValidatorsComponent {
  validatiorOptions = validatiorOptions;
  validators = signal<Option<keyof ValidatorsType>[]>(validatiorOptions.filter(o => o.value === 'required'));
  validatorValues = model<ValidatorsType>();

  hasValidator(validator: keyof ValidatorsType) {
    const value = this.validatorValues();
    return value && Object.keys(value).includes(validator);
  }

  updateValidators(validatorOption: Option[] | null) {
    this.validatorValues.update(validatorSet => {
      validatorOption?.map(o => o.value);
      return validatorSet;
    });
  }
}
