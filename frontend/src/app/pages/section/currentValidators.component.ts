import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SwitchComponent } from '../../components/action/switch.component';

export const internalValidatorObject = { required: 'Required' };
export type ValidatorOptions = typeof internalValidatorObject;
export type ValidatorValues = ValidatorOptions[keyof ValidatorOptions];

@Component({
  selector: 'current-validators',
  template: `
    <div class="container">
      <h2 class="h2">Validation</h2>
      @for (validator of internalValidatorObject | keyvalue; track validator.value) {
        <switch [label]="validator.value" [isChecked]="false" (isCheckedChange)="updateChecked(validator.key)" slim />
      }
    </div>
  `,
  styles: '',
  imports: [SwitchComponent, CommonModule],
})
export class CurrentValidatorsComponent {
  internalValidatorObject = internalValidatorObject;
  validatorSet = input<Set<Partial<ValidatorValues>>>(new Set());
  selectedValidators = output<Set<Partial<ValidatorValues>>>();

  updateChecked(value: string) {
    const validatorSet = new Set(...this.validatorSet());

    if (validatorSet.has(value)) validatorSet.delete(value);
    else validatorSet.add(value);

    this.selectedValidators.emit(validatorSet);
  }
}
