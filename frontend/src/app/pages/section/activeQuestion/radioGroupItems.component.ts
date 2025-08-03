import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from 'src/app/components/action/iconButton.component';
import { TextFieldComponent } from 'src/app/components/action/textfield.component';
import { ButtonStyleEnum, IconEnum } from 'src/helpers/enum';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconButtonComponent, TextFieldComponent, DialogModule],
  selector: 'answer-radio-group-items',
  template: `
    @if (!yesOrNoAnswer()) {
      <ul class="answer-list" list [formGroup]="radioGroup()">
        @for (answer of radioGroup().controls | keyvalue; let idx = $index; track answer.key) {
          <li class="answer-item">
            <text-field [control]="answer.value" slim />
            <icon-button [icon]="IconEnum.Remove" [buttonStyle]="ButtonStyleEnum.Border" (clicked)="remove.emit(idx)" />
          </li>
        }
        <li>
          <icon-button [icon]="IconEnum.Add" [buttonStyle]="ButtonStyleEnum.Border" (clicked)="add.emit()" />
        </li>
      </ul>
    }
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
  yesOrNoAnswer = model<boolean>(false);

  add = output();
  remove = output<number>();

  label(index: number) {
    return `Answer-${index + 1}`;
  }

  ngAfterContentInit(): void {
    console.log(this.radioGroup());
  }
}
