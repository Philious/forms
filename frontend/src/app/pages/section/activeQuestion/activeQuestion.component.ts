import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeEnum, Question, QuestionId } from '@cs-forms/shared';
import { ButtonStyleEnum } from 'src/helpers/enum';
import { SectionService } from 'src/services/section.service';
import { InputLayoutComponent } from '../../../components/action/input.layout.component';
import { TextButtonComponent } from '../../../components/action/textButton.component';
import { StatementsComponent } from '../conditions.component';
import { validatorsComponent } from '../validators.component';
import { AnswersComponent } from './answers.component';

@Component({
  selector: 'active-question',
  host: {
    list: '',
  },
  template: `
    @let question = this.currentQuestion();
    @if (question) {
      <div class="flex space-between">
        <h2 class="h2">Question</h2>
        <text-button label="Remove" (clicked)="removeQuestion.emit(question.id)" [buttonStyle]="ButtonStyleEnum.Filled" size=".75rem" />
      </div>
      <input-layout>
        <input input base-input [ngModel]="entry()" (ngModelChange)="entry.set($event)" />
      </input-layout>
      <div class="divider"></div>
      <answers [selectedAnswerType]="question.answerType ?? AnswerTypeEnum.RadioButton" (updateAnswerType)="updateType($event)" />
      <div class="divider"></div>
      <validators />
      <div class="divider"></div>
      <statements />
    }
  `,
  styles: '',
  imports: [ReactiveFormsModule, InputLayoutComponent, FormsModule, TextButtonComponent, AnswersComponent, validatorsComponent, StatementsComponent],
})
export class ActiveQuestionsComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  AnswerTypeEnum = AnswerTypeEnum;
  protected sectionService = inject(SectionService);

  question = input<Question | null>(null);
  save = input<boolean>(false);

  protected currentQuestion = this.sectionService.currentQuestion;

  removeQuestion = output<QuestionId>();
  entry = linkedSignal(() => this.question()?.entry);

  updateType(type: AnswerTypeEnum) {
    this.sectionService.question.update('answerType', type);
  }
}
