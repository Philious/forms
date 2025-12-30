import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry } from '@cs-forms/shared';
import { IconEnum, MainTabs } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { DataViewComponent } from '../components/dataView.component';
import { openBinaryDialog } from '../components/modals/binary.dialog.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { LocalStorageService } from '../services/localStorageService';
import { Store } from '../store/store';
import { checkIfSaved, clearCurrentifNotSaved } from './common/page.utilities';
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
        <tab-view class="tabs" [tabs]="tabs" [(selected)]="selectedTab" (update)="tabSelect($event)" [oneWayBinding]="true" />
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

    <data-view label="form" [data]="store.currentForm()" [startPosition]="{ bottom: '1rem', left: '1rem' }" />
    <data-view label="page" [data]="store.pages()" [startPosition]="{ top: '33%', right: '1rem' }" />
    <data-view label="division" [data]="store.currentDivision()" [startPosition]="{ bottom: '1rem', right: '1rem' }" />
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
  localStorage = inject(LocalStorageService);

  IconEnum = IconEnum;
  MainTabs = MainTabs;
  selectedSurvey = signal({ label: 'Mother of all Surveys', value: 'moas' });
  selectedTab = signal<MainTabs>(MainTabs.Entries);
  showTranslations = signal<boolean>(false);
  searchFilter = model<string>('');

  locale = computed(() => this.localeService.activeLocale().slice(3, 5));
  props = { content: () => 'content' };
  tabs: { label: string; value: MainTabs }[] = [
    { label: 'Entries', value: MainTabs.Entries },
    { label: 'Divisions', value: MainTabs.Divisions },
    { label: 'Pages', value: MainTabs.Pages },
    { label: 'Forms', value: MainTabs.Forms },
    { label: 'Test', value: MainTabs.Test },
  ];

  ngOnInit() {
    if (!this.store.forms()) this.selectedTab.set(MainTabs.Forms);
    else if (!this.store.pages()) this.selectedTab.set(MainTabs.Pages);
    else if (!this.store.divisions()) this.selectedTab.set(MainTabs.Divisions);
    else this.selectedTab.set(MainTabs.Entries);
  }

  async tabSelect(tab: MainTabs) {
    const prevSelected = this.selectedTab();

    switch (prevSelected) {
      case MainTabs.Test:
        this.selectedTab.set(tab);
        break;
      case MainTabs.Forms:
        const form = this.store.currentForm;
        const forms = this.store.forms;
        if (form && !checkIfSaved(form, forms))
          await openBinaryDialog('Current form is not saved', 'Continue anyway?')
            .then(() => clearCurrentifNotSaved(this.store.currentForm, this.store.forms()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case MainTabs.Pages:
        const page = this.store.currentPage;
        const pages = this.store.pages;
        if (page && !checkIfSaved(page, pages))
          await openBinaryDialog('Current page is not saved', 'Continue anyway?')
            .then(() => clearCurrentifNotSaved(this.store.currentPage, this.store.pages()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case MainTabs.Divisions:
        const division = this.store.currentPage;
        const divisions = this.store.pages;
        if (division && !checkIfSaved(division, divisions))
          await openBinaryDialog('Current division is not saved', 'Continue anyway?')
            .then(() => clearCurrentifNotSaved(this.store.currentDivision, this.store.divisions()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case MainTabs.Entries:
        const entry = this.store.currentEntry;
        const entries = this.store.entries;
        if (entry && !checkIfSaved<Entry>(entry, entries))
          await openBinaryDialog('Current entry is not saved', 'Continue anyway?')
            .then(() => clearCurrentifNotSaved(this.store.currentEntry, this.store.entries()))
            .catch(() => this.selectedTab.set(prevSelected));
    }
  }

  constructor() {
    Object.values(this.localStorage.clear).forEach(fn => fn());
    const init = effect(() => {
      if (Object.keys(this.store.forms() ?? {}).length < 1) this.tabSelect(MainTabs.Forms);
      else if (Object.keys(this.store.pages() ?? {}).length < 1) this.tabSelect(MainTabs.Pages);
      else if (Object.keys(this.store.divisions() ?? {}).length < 1) this.tabSelect(MainTabs.Divisions);
      else this.tabSelect(MainTabs.Entries);

      init.destroy();
    });
  }
}
