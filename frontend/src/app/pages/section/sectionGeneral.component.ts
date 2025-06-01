import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { Section } from '@cs-forms/shared';
import { Store } from 'src/stores/store';
import { Option } from '../../../helpers/types';
import { SectionService } from '../../../services/section.service';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { TextFieldComponent } from '../../components/action/textfield.component';

@Component({
  selector: 'section-general',
  host: {
    list: '',
  },
  template: `
    @if (sections()) {
      <drop-down slim [label]="'Section'" [options]="sections()" slim [modelValue]="selected()" (modelValueChange)="updateSelection($event)" />
      <text-field slim [label]="'Name'" [modelValue]="name()" (modelValueChange)="update('name', $event)" />
      <text-field slim [label]="'Description'" [modelValue]="description()" (modelValueChange)="update('description', $event)" />
    } @else {
      <span>Create a section to begin</span>
    }
  `,
  imports: [DropdownComponent, TextFieldComponent, CommonModule],
})
export class SectionGeneralComponent {
  private _store = inject(Store);
  private _sectionService = inject(SectionService);
  protected name = linkedSignal(() => this._sectionService.currentSection()?.name ?? '');
  protected description = linkedSignal(() => this._sectionService.currentSection()?.description ?? '');
  protected sections = this._store.sectionNameAndIdList;
  protected selected = linkedSignal<Option | null>(() => {
    const section = this._sectionService.currentSection();
    return section ? { label: section.name, value: section.id } : null;
  });

  constructor() {
    this._sectionService.getAll();
  }

  protected updateSelection(selected: Option | null) {
    this._store.section.setById(selected?.value ?? null);
  }

  protected update(key: keyof Section, value: string) {
    this._store.section.update(key, value);
    if (key === 'name')
      this.selected.update(s => {
        if (s) s.label = value;
        return s;
      });
  }
}
