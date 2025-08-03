import { Component } from '@angular/core';
import { ActiveQuestionsComponent } from './activeQuestion/activeQuestion.component';
import { SectionGeneralComponent } from './sectionGeneral.component';
import { SectionHeadComponent } from './sectionHead.component';
import { SectionQuestionListComponent } from './sectionQuestionList.component';

@Component({
  selector: 'sections-page',
  imports: [SectionQuestionListComponent, SectionGeneralComponent, SectionHeadComponent, ActiveQuestionsComponent],
  template: `
    <main class="section-main">
      <div class="section">
        <section-head />
        <section-general />
        <section-question-list />
      </div>
      <div list flex class="question">
        <active-question />
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
export class SectionComponent {}
