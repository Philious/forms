import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from 'src/services/question.service';
import { SectionService } from 'src/services/section.service';
import { MainTabs } from '../../helpers/enum';
import { TabViewComponent } from '../components/action/tabView.component';
import { DataViewComponent } from '../components/dataView.component';
import { FormsComponent } from './forms.page';
import { PagesComponent } from './pages.page';
import { QuestionsComponent } from './questions/questions.page';
import { SectionComponent } from './section/section.page';
import { TestComponent } from './test.page';

@Component({
  selector: 'main-view',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TabViewComponent,
    QuestionsComponent,
    SectionComponent,
    FormsComponent,
    TestComponent,
    FormsModule,
    PagesComponent,
    DataViewComponent,
  ],
  template: `
    <div class="top-section">
      <div class="row">
        <tab-view class="tabs" [tabs]="tabs" [selected]="MainTabs.Sections" (selectedEmitter)="tabSelect($event)" />
        <!--
        <drop-down class="survey-selector" flex [(modelValue)]="selectedSurvey" [label]="'Current survey'" />
        --->
      </div>
      <!--<tool-bar [(filter)]="searchFilter" />-->
    </div>
    <questions-page *ngIf="selectedTab() === MainTabs.Questions" />
    <sections-page *ngIf="selectedTab() === MainTabs.Sections" />
    <pages-page *ngIf="selectedTab() === MainTabs.Pages" />
    <forms-page *ngIf="selectedTab() === MainTabs.Forms" />
    <test-page *ngIf="selectedTab() === MainTabs.Test" />

    <data-view [label]="sectionLabel()" [data]="sectionService.currentSection()" />

    <data-view [label]="questionLabel()" [data]="questionService.currentQuestion()" />
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: grid;
      width: 100%;
      max-width: 80rem;
      height: 100%;
      min-height: 100vh;
      padding: 4rem;
      margin: auto;
      position: relative;
      place-content: start normal;
      .input-layout {
        --input-width: 100%;
      }
    }
    .top-section {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: var(--bg-clr);
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 3rem;
    }
    .toggle-translations {
      font-size: 0.825rem;
      display: flex;
      border-radius: 9rem;
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      height: 2.5rem;
      padding: 0 1.5rem;
      background-color: light-dark(#00000022, #ffffff22);
      align-items: center;
    }
  `,
})
export class MainPageComponent {
  sectionService = inject(SectionService);
  questionService = inject(QuestionService);
  sectionLabel = computed<string>(() => `sectionId: ${this.sectionService.currentSectionId()}`);
  questionLabel = computed<string>(() => `questionId: ${this.questionService.currentQuestionId()}`);

  dialog = inject(Dialog);
  MainTabs = MainTabs;
  selectedSurvey = signal({ label: 'Mother of all Surveys', value: 'moas' });
  selectedTab = signal(MainTabs.Sections);
  showTranslations = signal<boolean>(false);
  searchFilter = model<string>('');

  transUpdate(update: boolean) {
    console.log('emited', update);
  }
  constructor() {}

  tabs = [
    { label: 'Questions', value: MainTabs.Questions },
    { label: 'Sections', value: MainTabs.Sections },
    { label: 'Pages', value: MainTabs.Pages },
    { label: 'Forms', value: MainTabs.Forms },
    { label: 'Test', value: MainTabs.Test },
  ];

  tabSelect(tab: string) {
    this.selectedTab.set(tab as MainTabs);
  }
}
