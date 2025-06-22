import { Component, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonStyleEnum } from 'src/helpers/enum';
import { InputLayoutComponent } from '../../components/action/input.layout.component';
import { TextButtonComponent } from '../../components/action/textButton.component';

@Component({
  selector: 'current-question',
  host: {
    list: '',
  },
  template: `
    <div class="flex space-between">
      <h2 class="h2">Question</h2>
      <text-button label="Remove" (clicked)="removeQuestion.emit()" [buttonStyle]="ButtonStyleEnum.Filled" size=".75rem" />
    </div>
    <input-layout>
      <input input base-input [ngModel]="modelValue()" (ngModelChange)="modelValue.set($event)" />
    </input-layout>
  `,
  styles: '',
  imports: [ReactiveFormsModule, InputLayoutComponent, FormsModule, TextButtonComponent],
})
export class CurrentQuestionsComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  modelValue = model<string>('');
  removeQuestion = output();
}
