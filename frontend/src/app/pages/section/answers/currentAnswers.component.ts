import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeEnum } from '@cs-forms/shared';
import { SectionService } from 'src/services/section.service';
import { v4 as uid } from 'uuid';
import { ButtonStyleEnum, IconEnum } from '../../../../helpers/enum';
import { Option } from '../../../../helpers/types';
import { CheckboxComponent } from '../../../components/action/checkbox.component';
import { DropdownComponent } from '../../../components/action/dropdown.component';
import { awnserTypeOptions } from '../static';
import { BarometerComponent } from './barometer.component';
import { RadioGroupComponent } from './radioGroup.component';

@Component({
  selector: 'current-answers',
  host: {
    list: '',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownComponent,
    DialogModule,
    RadioGroupComponent,
    BarometerComponent,
    CheckboxComponent,
  ],
  template: `
    <h2 class="h2">Answers</h2>
    <span>
      <drop-down [label]="'Answer type'" [options]="awnserTypeOptions" slim [(modelValue)]="answerTypeSelected" />
    </span>

    @if (AnswerTypeEnum.Barometer === answerTypeSelected().value) {
      <answer-barometer [step]="0.1" [min]="2" [max]="5" />
    } @else if (AnswerTypeEnum.Dropdown) {
    } @else if (AnswerTypeEnum.Checkbox) {
      <check-box />
    } @else if (AnswerTypeEnum.RadioButton) {
      <answer-radio-group [radioGroup]="answerGroup" (add)="addAnswer()" (remove)="removeAnswer($event)" />
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
export class CurrentAnswersComponent {
  sectionService = inject(SectionService);
  AnswerTypeEnum = AnswerTypeEnum;
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  awnserTypeOptions = awnserTypeOptions;
  singleLabel = model('');

  answerTypeSelected = model<Option<AnswerTypeEnum>>(awnserTypeOptions[0]);

  isRadioAnswers = computed(() => this.answerTypeSelected().value !== this.AnswerTypeEnum.RadioButton);

  yesOrNoAnswer = linkedSignal<boolean>(() => {
    if (this.isRadioAnswers()) return false;
    return false;
  });

  answerGroup = new FormGroup({});

  addAnswer() {
    const index = Object.keys(this.answerGroup.controls).length + 1;
    this.answerGroup.addControl(uid(), new FormControl(`answer${index}`));
  }

  removeAnswer(idx: number) {
    const controlName = Object.keys(this.answerGroup.controls)[idx];
    this.answerGroup.removeControl(controlName);
  }
}
