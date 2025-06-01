import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeEnum } from '@cs-forms/shared';
import { SwitchComponent } from 'src/app/components/action/switch.component';
import { SlideInOutDirective } from 'src/app/directives/slideInOut.directive';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { QuestionService } from '../../../services/question.service';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { IconButtonComponent } from '../../components/action/iconButton.component';
import { TextFieldComponent } from '../../components/action/textfield.component';

@Component({
  selector: 'current-answers',
  host: {
    list: '',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IconButtonComponent,
    DropdownComponent,
    TextFieldComponent,
    DialogModule,
    SwitchComponent,
    SlideInOutDirective,
  ],
  template: `
    <h2 class="h2">Answers</h2>
    <span>
      <drop-down [label]="'Answer type'" [options]="awnserTypeOptions" slim [(modelValue)]="answerTypeSelected" />
      <switch [label]="'Yes/No'" [(isChecked)]="yesOrNoAnswer" slim slideInOut [visible]="isRadioAnswers()" />
    </span>
    <ul class="answer-list" list [formGroup]="answerGroup">
      @if (answerTypeSelected().value === AnswerTypeEnum.RadioButton) {
        @for (answer of answerGroup.controls | keyvalue; let idx = $index; track answer.key) {
          <li class="answer-item">
            <text-field [control]="answer.value" slim [label]="label('Answer', idx + 1)" />
          </li>
        }
        <li>
          <icon-button [icon]="IconEnum.Add" [buttonStyle]="ButtonStyleEnum.Border" (onClick)="addAnswer()" />
        </li>
      }
    </ul>
  `,
  styles: `
    .answer-list:empty {
      display: none;
    }
  `,
})
export class CurrentAnswersComponent implements OnInit {
  AnswerTypeEnum = AnswerTypeEnum;
  questionService = inject(QuestionService);

  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  awnserTypeOptions: Option<AnswerTypeEnum>[] = [
    {
      label: 'Barometer',
      value: AnswerTypeEnum.Barometer,
    },
    {
      label: 'Checkbox',
      value: AnswerTypeEnum.Checkbox,
    },
    {
      label: 'Date',
      value: AnswerTypeEnum.Date,
    },
    {
      label: 'Dropdown',
      value: AnswerTypeEnum.Dropdown,
    },
    {
      label: 'Number',
      value: AnswerTypeEnum.Number,
    },

    {
      label: 'Radio buttons',
      value: AnswerTypeEnum.RadioButton,
    },
    {
      label: 'Textbox',
      value: AnswerTypeEnum.Text,
    },
    {
      label: 'Textarea',
      value: AnswerTypeEnum.Textarea,
    },
  ];
  answerTypeSelected = model<Option<AnswerTypeEnum>>(this.awnserTypeOptions[0]);

  isRadioAnswers = computed(() => this.answerTypeSelected().value !== this.AnswerTypeEnum.RadioButton);

  yesOrNoAnswer = linkedSignal<boolean>(() => {
    if (this.isRadioAnswers()) return false;
    return false;
  });
  answerGroup = new FormGroup({});

  label = (text: string, index: number) => text + index;

  ngOnInit(): void {
    this.answerGroup.addControl('answer1', new FormControl(''));
  }

  addAnswer() {
    const index = Object.keys(this.answerGroup.controls).length + 1;
    this.answerGroup.addControl(`answer${index}`, new FormControl(''));
  }
}
