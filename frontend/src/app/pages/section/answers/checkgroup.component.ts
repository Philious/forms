import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from 'src/app/components/action/iconButton.component';
import { SwitchComponent } from 'src/app/components/action/switch.component';
import { TextFieldComponent } from 'src/app/components/action/textfield.component';
import { SlideInOutDirective } from 'src/app/directives/slideInOut.directive';
import { ButtonStyleEnum, IconEnum } from 'src/helpers/enum';
import { awnserTypeOptions } from '../static';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IconButtonComponent,
    TextFieldComponent,
    DialogModule,
    SwitchComponent,
    SlideInOutDirective,
  ],
  selector: 'answer-check-group',
  template: `
    <switch [label]="'Yes/No'" [(isChecked)]="yesOrNoAnswer" slim slideInOut />
    @if (!yesOrNoAnswer()) {
      <ul class="answer-list" list [formGroup]="radioGroup()">
        @for (answer of radioGroup().controls | keyvalue; let idx = $index; track answer.key) {
          <li class="answer-item">
            <text-field [control]="answer.value" slim [label]="label(idx)" />
            <icon-button [icon]="IconEnum.Remove" [buttonStyle]="ButtonStyleEnum.Border" (onClick)="remove.emit(idx)" />
          </li>
        }
        <li>
          <icon-button [icon]="IconEnum.Add" [buttonStyle]="ButtonStyleEnum.Border" (onClick)="add.emit()" />
        </li>
      </ul>
    }
  `,
  styles: '',
})
export class CheckGroupComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  awnserTypeOptions = awnserTypeOptions;

  radioGroup = input.required<FormGroup<Record<string, FormControl>>>();
  yesOrNoAnswer = model<boolean>(false);

  add = output();
  remove = output<number>();

  label(index: number) {
    return `Answer-${index + 1}`;
  }
}
