import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconEnum, MainTabs } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { DataViewComponent } from '../components/dataView.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { Store } from '../store/store';
import { DivisionPageComponent } from './divisions.component';
import { EntriesComponent } from './entries/entries.page';
import { FormPageComponent } from './forms.component';
import { PagePageComponent } from './pages.component';
import { TestPageComponent } from './test.component';

@Component({
  selector: 'main-view',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TabViewComponent,
    EntriesComponent,
    DivisionPageComponent,
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
        <tab-view class="tabs" [tabs]="tabs" [selected]="selectedTab()" (selectedChange)="tabSelect($event)" />
        <div class="global-settings">
          <icon-button title="Test form" class="play" [icon]="IconEnum.Play" />
          <div class="locale">{{ locale() }}</div>
        </div>
      </div>
    </div>
    @if (selectedTab() === MainTabs.Entries) {
      <entries-page />
    } @else if (selectedTab() === MainTabs.Divisions) {
      <division-page />
    } @else if (selectedTab() === MainTabs.Pages) {
      <pages-page />
    } @else if (selectedTab() === MainTabs.Forms) {
      <forms-page />
    } @else {
      <test-page />
    }

    <data-view label="form" [data]="store.currentForm()" [startPosition]="{ bottom: '1rem', right: '50%' }" />
    <data-view label="page" [data]="store.currentPage()" [startPosition]="{ bottom: '1rem', left: '1rem' }" />
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
    .global-settings {
      display: flex;
      align-items: center;
    }
    .locale {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      font-size: 0.85rem;
      color: var(--n-400);
      font-weight: 600;
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
export class MainPageComponent implements OnInit {
  apiService = inject(ApiService);
  store = inject(Store);
  localeService = inject(LocaleService);
  dialog = inject(Dialog);

  IconEnum = IconEnum;
  MainTabs = MainTabs;
  selectedSurvey = signal({ label: 'Mother of all Surveys', value: 'moas' });
  selectedTab = signal(MainTabs.Entries);
  showTranslations = signal<boolean>(false);
  searchFilter = model<string>('');

  locale = computed(() => this.localeService.activeLocale().slice(3, 5));

  tabs = [
    { label: 'Entries', value: MainTabs.Entries },
    { label: 'Divisions', value: MainTabs.Divisions },
    { label: 'Pages', value: MainTabs.Pages },
    { label: 'Forms', value: MainTabs.Forms },
    { label: 'Test', value: MainTabs.Test },
  ];

  ngOnInit() {
    console.log(this.store.forms());
    if (!this.store.forms()) this.tabSelect(MainTabs.Forms);
    else if (!this.store.pages()) this.tabSelect(MainTabs.Pages);
    else if (!this.store.divisions()) this.tabSelect(MainTabs.Divisions);
    else this.tabSelect(MainTabs.Entries);
  }

  tabSelect(tab: string | null) {
    this.selectedTab.set(tab as MainTabs);
  }

  constructor() {
    const init = effect(() => {
      if (this.store.forms() === null) return;
      if (Object.keys(this.store.forms() ?? {}).length < 1) this.tabSelect(MainTabs.Forms);
      else if (Object.keys(this.store.pages() ?? {}).length < 1) this.tabSelect(MainTabs.Pages);
      else if (Object.keys(this.store.divisions() ?? {}).length < 1) this.tabSelect(MainTabs.Divisions);
      else this.tabSelect(MainTabs.Entries);

      init.destroy();
    });
  }
}
