import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from 'src/app/components/action/iconButton.component';

import { ButtonStyleEnum, IconEnum } from 'src/helpers/enum';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconButtonComponent, DialogModule],
  selector: 'answer-textarea',
  template: ` <label> </label> `,
  styles: '',
})
export class TextareaComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  radioGroup = input.required<FormGroup<Record<string, FormControl>>>();
  yesOrNoAnswer = model<boolean>(false);

  label(index: number) {
    return `Answer-${index + 1}`;
  }
}
