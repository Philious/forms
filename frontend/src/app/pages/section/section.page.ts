import { Component, inject, linkedSignal } from '@angular/core';
import { SectionService } from '../../../services/section.service';
import { CurrentAnswersComponent } from './answers/currentAnswers.component';
import { CurrentStatementsComponent } from './currentIfStatements.component';
import { CurrentQuestionsComponent } from './currentQuestion.component';
import { CurrentValidatorsComponent } from './currentValidators.component';
import { SectionGeneralComponent } from './sectionGeneral.component';
import { SectionHeadComponent } from './sectionHead.component';
import { SectionQuestionListComponent } from './sectionQuestionList.component';

@Component({
  selector: 'sections-page',
  imports: [
    CurrentQuestionsComponent,
    CurrentAnswersComponent,
    CurrentValidatorsComponent,
    CurrentStatementsComponent,
    SectionQuestionListComponent,
    SectionGeneralComponent,
    SectionHeadComponent,
  ],
  template: `
    <main class="section-main">
      <div class="section">
        <section-head />
        <section-general />
        @if (sectionService.currentSection()) {
          <section-question-list />
        }
      </div>
      <div list flex class="question">
        @if (sectionService.currentQuestion()) {
          <current-question [modelValue]="currentQuestion()" (modelValueChange)="updateEntry($event)" (removeQuestion)="removeQuestion()" />
          <div class="divider"></div>
          <current-answers />
          <div class="divider"></div>
          <current-validators />
          <div class="divider"></div>
          <current-statements />
        }
      </div>
    </main>
  `,
  styles: `
    :host {
      background-color: var(--n-200);
      border-radius: 0.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .section-main {
      display: flex;
      width: 100%;
      height: 100%;
      flex: 1;
    }
    .container {
      display: grid;
      gap: 1rem;
    }
    .divider {
      background-color: var(--n-400);
      height: 0.0625rem;
      width: 100%;
    }
    .section {
      display: grid;
      align-items: start;
      align-content: start;
      gap: 1rem;
      flex: 1;
      width: 100%;
      padding: 1.5rem;
      border-radius: 0.25rem;
    }
    .question {
      background-color: var(--n-100);
      margin: 0.25rem;
      padding: 1.5rem;
      border-radius: 0.25rem;
      &:empty {
        place-content: center;
        &:before {
          content: 'Select a question';
          margin: auto;
          color: var(--n-400);
        }
      }
    }
  `,
})
export class SectionComponent {
  protected sectionService = inject(SectionService);
  currentQuestion = linkedSignal<string>(() => this.sectionService.currentQuestion()?.entry ?? '');
  updateEntry(entry: string) {
    this.sectionService.updateCurrentQuestion('entry', entry);
  }
  removeQuestion = () => {};
}
