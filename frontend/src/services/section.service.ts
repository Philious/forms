import { moveItemInArray } from '@angular/cdk/drag-drop';
import { inject, Injectable } from '@angular/core';
import { Section, SectionId } from '@cs-forms/shared';
import { SectionStore } from 'src/stores/sectionStore';
import { Store } from 'src/stores/store';
import { v4 as uid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private readonly _store = inject(Store);
  private readonly _sectionStore = inject(SectionStore);
  // Public read-only signals

  getAll() {
    this._sectionStore.getAll().subscribe(sections => this._store.section.storeBatch(sections));
  }

  sectionIds = this._store.sectionIds;
  currentSectionId = this._store.currentSectionId;
  currentSection = this._store.currentSection;

  add = (name: string): void => {
    const payload: Section = {
      id: `question-${uid()}`,
      name,
      description: '',
      updated: new Date().valueOf(),
      questions: [],
    };
    this._store.section.add(payload);
  };

  set = (id: SectionId | null): void => {
    if (id) {
      const section = this._store.section.get(id);
      this._store.section.set(section);
    } else this._store.section.set(null);
  };

  delete = (id: string): void => {
    this._sectionStore.remove(id);
    this._store.section.remove(id);
  };

  saveCurrentSection() {
    const section = this._store.currentSection();
    if (section) {
      const payload = this._store.sectionToPayload(section);
      if (this._store.sectionIds().find(s => s === payload.id)) {
        this._sectionStore.update(payload);
      }
    }
  }

  update = <K extends keyof Section>(key: K, update: Section[K]): void => {
    this._store.section.update(key, update);
  };

  updateQuestionListOrder(prevIndex: number, currIndex: number): void {
    const section = this._store.currentSection();
    if (section) {
      moveItemInArray([...section.questions], prevIndex, currIndex);
      this._store.section.update('questions', section.questions);
    }
  }
}
