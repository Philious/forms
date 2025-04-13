import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainTabs } from '../../helpers/enum';
import { TabViewComponent } from '../components/action/tabView.component';
import { ToolBarComponent } from '../components/toolbar.component';
import { Forms } from './forms.page';
import { Pages } from './pages.page';
import { Questions } from './questions.page';
import { SectionComponent } from './section/sections.page';
import { Test } from './test.page';

@Component({
  selector: 'mainView',
  imports: [ReactiveFormsModule, CommonModule, TabViewComponent, Questions, SectionComponent, Forms, Test, FormsModule, Pages, ToolBarComponent],
  template: `
    <div class="top-section">
      <div class="title">Form name</div>
      <tab-view class="tabs" [tabs]="tabs" (tabSelect)="tabSelect($event)" />
      <tool-bar [(filter)]="searchFilter" />
    </div>
    <questions *ngIf="selected() === MainTabs.Questions" />
    <sections-page *ngIf="selected() === MainTabs.Sections" />
    <pages-page *ngIf="selected() === MainTabs.Pages" />
    <forms-page *ngIf="selected() === MainTabs.Forms" />
    <test-page *ngIf="selected() === MainTabs.Test" />
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
  dialog = inject(Dialog);
  MainTabs = MainTabs;
  selected = signal(MainTabs.Sections);
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
    this.selected.set(tab as MainTabs);
  }
}
