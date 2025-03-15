import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainTabs } from '../../helpers/enum';
import { TabViewComponent } from '../components/action/tabView.component';
import { Questions } from '../components/questions/questions.component';
import { Sections } from './sections.page';
import { Forms } from './forms.page';
import { Test } from './test.page';
import { Switch } from '../components/action/switch.component'
import { TranslationService } from '../../services/translation.service';
import { Pages } from "./pages.page";
import { ManageQuestionDialogComponent } from '../components/modals/manageQuestiondialog.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'mainView',
  imports: [ReactiveFormsModule, CommonModule, TabViewComponent, Questions, Sections, Forms, Test, FormsModule, Switch, Pages],
  template: `
    <div class="top-section">
      <div class="title">Form name</div>
        <tab-view class="tabs" [tabs]="tabs" (tabSelect)="tabSelect($event)"/>
      </div>
      <questions *ngIf="selected() === MainTabs.Questions" />
      <sections-page *ngIf="selected() === MainTabs.Sections"/>
      <pages-page *ngIf="selected() === MainTabs.Pages" />
      <forms-page *ngIf="selected() === MainTabs.Forms"/>
      <test-page *ngIf="selected() === MainTabs.Test"/>
      <div class="toggle-translations">
        <switch  [label]="'Toggle ids'" (onChange)="translationService.updateShowTranslations($event)"/>
      </div>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: grid;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      padding: 4rem;
      margin: auto;
      position: relative;
      place-content: start normal;
      .input-layout { --input-width: 100%; }
    }
    .top-section {
      position: sticky;
      top: 0;
      z-index:1;
      background-color: var(--bg-clr); 
    }
    .toggle-translations {
      font-size: .825rem;
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
  `
})

export class MainPage {
  dialog = inject(Dialog);
  translationService = inject(TranslationService)
  MainTabs = MainTabs;
  selected = signal(MainTabs.Questions);
  showTranslations = signal<boolean>(false);

  transUpdate(update: boolean) {
    console.log('emited', update)

  }
  constructor() {

  }

  tabs = [
    { label: 'Questions', value: MainTabs.Questions },
    { label: 'Sections', value: MainTabs.Sections },
    { label: 'Pages', value: MainTabs.Pages },
    { label: 'Forms', value: MainTabs.Forms },
    { label: 'Test', value: MainTabs.Test },
  ];

  tabSelect(tab: string) {
    this.selected.set(tab as MainTabs)
  };



}
