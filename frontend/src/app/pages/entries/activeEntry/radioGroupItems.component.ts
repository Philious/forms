import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from 'src/app/components/action/iconButton.component';
import { TextFieldComponent } from 'src/app/components/action/textfield.component';
import { TranslationInputComponent } from 'src/app/components/action/translationInput';
import { ButtonStyleEnum, IconEnum } from 'src/helpers/enum';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconButtonComponent, TextFieldComponent, DialogModule, TranslationInputComponent],
  selector: 'answer-radio-group-items',
  template: `
    <ul class="answer-list" list [formGroup]="radioGroup()">
      @for (answer of radioGroup().controls | keyvalue; let idx = $index; track answer.key) {
        <li class="answer-item">
          <translation-input />
          <icon-button [icon]="IconEnum.Remove" [style]="ButtonStyleEnum.Border" (clicked)="remove.emit(idx)" />
        </li>
      }
    </ul>
  `,
  styles: `
    .answer-item {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }
  `,
})
export class RadioGroupItemsComponent implements AfterContentInit {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  radioGroup = input.required<FormGroup<Record<string, FormControl>>>();

  add = output();
  remove = output<number>();

  label(index: number) {
    return `Answer-${index + 1}`;
  }

  ngAfterContentInit(): void {
    console.log(this.radioGroup());
  }
}
