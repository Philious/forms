import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum, MainTabs } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/iconButton.component';
import { TabViewComponent } from '../components/action/tabView.component';
import { DataViewComponent } from '../components/dataView.component';
import { ApiService } from '../services/api.service';
import { Store } from '../store/store';
import { EntriesComponent } from './entries/entries.page';
import { FormPageComponent } from './forms.component';
import { PagePageComponent } from './pages.component';
import { SectionComponent } from './section/section.page';
import { TestPageComponent } from './test.component';

@Component({
  selector: 'main-view',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TabViewComponent,
    EntriesComponent,
    SectionComponent,
    FormPageComponent,
    TestPageComponent,
    FormsModule,
    PagePageComponent,
    DataViewComponent,
    IconButtonComponent,
  ],
  template: `
    <div class="top-section">
      <div class="row">
        <tab-view class="tabs" [tabs]="tabs" [selected]="selectedTab()" (selectedEmitter)="tabSelect($event)" />
        <icon-button title="Test form" class="play" [icon]="IconEnum.Play" />
      </div>
    </div>
    @if (selectedTab() === MainTabs.Entries) {
      <entries-page />
    } @else if (selectedTab() === MainTabs.Sections) {
      <sections-page />
    } @else if (selectedTab() === MainTabs.Pages) {
      <pages-page />
    } @else if (selectedTab() === MainTabs.Forms) {
      <forms-page />
    } @else {
      <test-page />
    }

    <data-view label="Entries" [data]="store.entries()" [startPosition]="{ bottom: '1rem', left: '1rem' }" />
    <data-view label="Forms" [data]="store.currentEntry()" [startPosition]="{ bottom: '1rem', right: '50%' }" />
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 80rem;
      height: 100%;
      min-height: 100vh;
      padding: 0.5rem;
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
    .play {
      width: 3rem;
      height: 3rem;
    }
  `,
})
export class MainPageComponent {
  apiService = inject(ApiService);
  store = inject(Store);
  dialog = inject(Dialog);

  IconEnum = IconEnum;
  MainTabs = MainTabs;
  selectedSurvey = signal({ label: 'Mother of all Surveys', value: 'moas' });
  selectedTab = signal(MainTabs.Entries);
  showTranslations = signal<boolean>(false);
  searchFilter = model<string>('');

  constructor() {
    effect(() => console.log(this.store.entries(), this.store.currentEntry()));
  }

  tabs = [
    { label: 'Entries', value: MainTabs.Entries },
    { label: 'Sections', value: MainTabs.Sections },
    { label: 'Pages', value: MainTabs.Pages },
    { label: 'Forms', value: MainTabs.Forms },
    { label: 'Test', value: MainTabs.Test },
  ];

  tabSelect(tab: string) {
    this.selectedTab.set(tab as MainTabs);
  }
}
