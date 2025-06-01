import { Component, inject } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import { SectionService } from '../../../services/section.service';
import { CurrentAnswersComponent } from './currentAnswers.component';
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
      <div class="left-section">
        <section-head />
        <section-general />
        @if (sectionService.currentSection()) {
          <section-question-list />
        }
      </div>
      <div list flex>
        @if (this.questionService.currentQuestion()) {
          <current-question />
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
    .section-main {
      display: flex;
      width: 100%;
      height: 100%;
      gap: 2.5rem;
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
    .left-section {
      display: grid;
      align-items: start;
      align-content: start;
      gap: 1rem;
      flex: 1;
      width: 100%;
      padding: 1.5rem;
      border-radius: 0.25rem;
      background: var(--n-100);
    }
  `,
})
export class SectionComponent {
  questionService = inject(QuestionService);
  sectionService = inject(SectionService);
}
