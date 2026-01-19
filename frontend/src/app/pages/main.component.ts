import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Entry } from '@cs-forms/shared';
import { IconEnum, MainTabs } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { DataViewComponent } from '../components/dataView.component';

import { MiniLangTabsComponent } from '../components/action/mini-lang.component';
import { BinaryDialog } from '../components/modals/binary.dialog.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { LocalStorageService } from '../services/localStorageService';
import { Store } from '../store/store';
import { checkIfSaved, clearCurrentifNotSaved } from './common/page.utilities';
import { DivisionPageComponent } from './divisions.component';
import { EntriesComponent } from './entries/entries.component';
import { FormPageComponent } from './forms.component';
import { PagePageComponent } from './pages.component';
import { TestPageComponent } from './test/test.component';

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
    MiniLangTabsComponent,
  ],
  template: `
    <tab-view
      class="tabs top-section"
      [tabs]="[
        { label: 'Entries', template: entries },
        { label: 'Divisions', template: division },
        { label: 'Pages', template: page },
        { label: 'Forms', template: form },
        { label: 'Test', template: test },
      ]"
      [(selected)]="selectedTab"
    >
      <div class="global-settings">
        <icon-button title="Test form" class="play" [icon]="IconEnum.Play" />
        <mini-lang [menuSelector]="true" />
      </div>
    </tab-view>
    <ng-template #entries>
      <entries-page />
    </ng-template>
    <ng-template #division>
      <division-page />
    </ng-template>
    <ng-template #page>
      <pages-page />
    </ng-template>
    <ng-template #form>
      <forms-page />
    </ng-template>
    <ng-template #test>
      <test-page />
    </ng-template>

    <data-view label="Current entry" [data]="store.currentEntry()" [startPosition]="{ bottom: '1rem', left: '1rem' }" />
    <!--
    <data-view label="page" [data]="store.pages()" [startPosition]="{ top: '33%', right: '1rem' }" />
    <data-view label="division" [data]="store.currentDivision()" [startPosition]="{ bottom: '1rem', right: '1rem' }" />
    -->
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
      flex: 1;
      justify-content: flex-end;
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
export class MainPageComponent {
  apiService = inject(ApiService);
  store = inject(Store);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  binaryDialog = inject(BinaryDialog);

  IconEnum = IconEnum;
  MainTabs = MainTabs;
  selectedSurvey = signal({ label: 'Mother of all Surveys', value: 'moas' });
  selectedTab = signal<string>('Entries');
  showTranslations = signal<boolean>(false);
  searchFilter = model<string>('');

  locale = computed(() => this.localeService.activeLocale().slice(3, 5));
  props = { content: () => 'content' };

  async tabSelect(tab: string) {
    const prevSelected = this.selectedTab();

    this.selectedTab.set(tab);
    switch (prevSelected) {
      case 'Test':
        break;
      case 'Forms':
        const form = this.store.currentForm;
        const forms = this.store.forms;
        if (form && !checkIfSaved(form, forms))
          await this.binaryDialog
            .open({ title: 'Current form is not saved', content: 'Continue anyway?' })
            .then(() => clearCurrentifNotSaved(this.store.currentForm, this.store.forms()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case 'Pages':
        const page = this.store.currentPage;
        const pages = this.store.pages;
        if (page && !checkIfSaved(page, pages))
          await this.binaryDialog
            .open({ title: 'Current page is not saved', content: 'Continue anyway?' })
            .then(() => clearCurrentifNotSaved(this.store.currentPage, this.store.pages()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case 'Divisions':
        const division = this.store.currentPage;
        const divisions = this.store.pages;
        if (division && !checkIfSaved(division, divisions))
          await this.binaryDialog
            .open({ title: 'Current division is not saved', content: 'Continue anyway?' })
            .then(() => clearCurrentifNotSaved(this.store.currentDivision, this.store.divisions()))
            .catch(() => this.selectedTab.set(prevSelected));
        break;
      case 'Entries':
        const entry = this.store.currentEntry;
        const entries = this.store.entries;
        if (entry && !checkIfSaved<Entry>(entry, entries))
          await this.binaryDialog
            .open({ title: 'Current entry is not saved', content: 'Continue anyway?' })
            .then(() => clearCurrentifNotSaved(this.store.currentEntry, this.store.entries()))
            .catch(() => this.selectedTab.set(prevSelected));
    }
  }

  constructor() {
    // Using local storage ??
    Object.values(this.localStorage.clear).forEach(fn => fn());
    const init = effect(() => {
      const forms = this.store.forms();
      const pages = this.store.pages();
      const divs = this.store.divisions();

      if (!forms || Object.keys(forms).length < 1) this.tabSelect('Forms');
      else if (!pages || Object.keys(pages).length < 1) this.tabSelect('Pages');
      else if (!divs || Object.keys(divs).length < 1) this.tabSelect('Divisions');
      else this.tabSelect('Entries');

      if (forms || pages || divs) init.destroy();
    });
  }
}
