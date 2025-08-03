import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeEnum } from '@cs-forms/shared';
import { SwitchComponent } from 'src/app/components/action/switch.component';
import { SlideInOutDirective } from 'src/app/directives/slideInOut.directive';
import { v4 as uid } from 'uuid';
import { ButtonStyleEnum, IconEnum } from '../../../../helpers/enum';
import { DropdownComponent } from '../../../components/action/dropdown.component';
import { awnserTypeOptions } from './answer.static';
import { BarometerComponent } from './barometer.component';
import { CheckGroupComponent } from './checkGroupItems.component';
import { RadioGroupItemsComponent } from './radioGroupItems.component';

@Component({
  selector: 'answers',
  host: {
    list: '',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownComponent,
    DialogModule,
    BarometerComponent,
    RadioGroupItemsComponent,
    CheckGroupComponent,
    SwitchComponent,
    SlideInOutDirective,
  ],
  template: `
    <h2 class="h2">Answers</h2>
    <span>
      <drop-down
        [label]="'Answer type'"
        [options]="awnserTypeOptions"
        slim
        [modelValue]="selectedAnswerType()"
        (modelValueChange)="changeType(reType($event))"
      />
      @if (displayYesOrNoOption()) {
        <switch [label]="'Binary question'" [(isChecked)]="yesOrNoAnswer" slim slideInOut />
      }
    </span>

    @if (AnswerTypeEnum.Barometer === selectedAnswerType()) {
      <answer-barometer [step]="0.1" [min]="2" [max]="5" />
    } @else if (AnswerTypeEnum.Checkbox === selectedAnswerType()) {
      <answer-check-group-items [radioGroup]="formGroup" />
    } @else if (AnswerTypeEnum.Dropdown === selectedAnswerType()) {
      Dropdown
    } @else if (AnswerTypeEnum.RadioButton === selectedAnswerType()) {
      <answer-radio-group-items [radioGroup]="formGroup" (add)="addAnswer()" (remove)="removeAnswer($event)" />
    }
  `,
  styles: `
    .answer-list:empty {
      display: none;
    }

    .toggle-state-icon {
      width: 1.5rem;
      stroke: var(--n-500);
      .linear {
      }
      .inverse-linear {
      }
    }
  `,
})
export class AnswersComponent {
  AnswerTypeEnum = AnswerTypeEnum;
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  awnserTypeOptions = awnserTypeOptions;

  selectedAnswerType = input<AnswerTypeEnum>(AnswerTypeEnum.RadioButton);
  updateAnswerType = output<AnswerTypeEnum>();

  yesOrNoAnswer = model<boolean>(false);
  displayYesOrNoOption = computed<boolean>(() => this.selectedAnswerType() === this.AnswerTypeEnum.RadioButton);

  formGroup = new FormGroup({});

  constructor() {
    this.changeType(this.selectedAnswerType());
  }

  reType(value: unknown) {
    return value as AnswerTypeEnum;
  }

  addAnswer() {
    const index =
      Object.keys(this.formGroup.controls)
        .map(k => parseInt(k.split(/[$-]/g)[1]))
        .sort()
        .pop() ?? 0;
    console.log('index: ', index);
    this.formGroup.addControl(`$${index + 1}-${uid()}`, new FormControl(''));
    console.log(this.formGroup.controls);
  }

  removeAnswer(idx: number) {
    const controlName = Object.keys(this.formGroup.controls)[idx];
    this.formGroup.removeControl(controlName);
  }

  changeType(type: AnswerTypeEnum) {
    this.formGroup.controls = {};
    if (type === AnswerTypeEnum.RadioButton) {
      ['Answer 1', 'Answer 2'].forEach((v, i) => this.formGroup.addControl(`$${i}-${uid()}`, new FormControl(v)));
    }
  }
}
