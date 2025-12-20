import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsType } from '@src/helpers/types';
import { DropdownComponent, SelectorItem } from '../../../components/action/dropdown.component';
import { validatiorOptions } from './validation.static';

@Component({
  selector: 'validation',
  template: `
    <div class="container">
      <drop-down [items]="validatiorOptions" [formControl]="validatorsCtrl" slim [multiSelect]="true" />
    </div>
  `,
  styles: `
    .container {
      display: grid;
      gap: 1.5rem;
    }
  `,
  imports: [CommonModule, DropdownComponent, ReactiveFormsModule],
})
export class validatonComponent {
  validatiorOptions = validatiorOptions;
  validators = model<(keyof ValidatorsType)[]>(['required']);

  validatorsCtrl = new FormControl<SelectorItem[]>([{ id: 'required', label: 'Required' }]);
}
