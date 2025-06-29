import { CommonModule } from '@angular/common';
import { Component, linkedSignal, model } from '@angular/core';
import { ValidatorsType } from 'src/helpers/types';
import { Option } from '../../../helpers/types';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { SwitchComponent } from '../../components/action/switch.component';
type t = keyof ValidatorsType;
@Component({
  selector: 'current-validators',
  template: `
    <div class="container">
      <h2 class="h2">Validation</h2>
      <drop-down [options]="validatiorOptions" [modelValue]="validatiorOptions" [multiSelect]="true" (modelValueChange)="updateValidators($event)" />
      <switch [label]="'Recuired'" [isChecked]="required()" (isCheckedChange)="updateChecked($event)" slim />
    </div>
  `,
  styles: '',
  imports: [SwitchComponent, CommonModule, DropdownComponent],
})
export class CurrentValidatorsComponent {
  required = model<boolean>(true);
  validators = linkedSignal<(keyof ValidatorsType)[]>(() => ['required']);
  // selectedValidators = output<Set<Partial<ValidatorValues>>>();
  validatiorOptions: Option<keyof ValidatorsType>[] = [
    { label: 'Minimum', value: 'min' },
    { label: 'Maximum', value: 'max' },
  ];

  updateValidators(validatorOption: Option[] | null) {
    console.log(validatorOption);
  }

  updateChecked(ev: boolean) {
    console.log(ev);
    /*
    const validatorSet = new Set(...this.validatorSet());

    if (validatorSet.has(value)) validatorSet.delete(value);
    else validatorSet.add(value);

    this.selectedValidators.emit(validatorSet);
    */
  }
}
