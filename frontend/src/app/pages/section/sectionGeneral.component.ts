import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { extendedArray, ExtendedArray } from '@app/helpers/utils';
import { Section, SectionId } from '@cs-forms/shared';
import { SectionService } from '../../../services/section.service';
import { DropdownComponent, SelectorItem } from '../../components/action/dropdown.component';
import { TextFieldComponent } from '../../components/action/textfield.component';

@Component({
  selector: 'section-general',
  host: {
    list: '',
  },
  template: `
    @if (sectionList()) {
      <drop-down slim [items]="sectionList()" slim [formControl]="sectionControl" [multiSelect]="false" />
      <text-field slim [label]="'Name'" [modelValue]="name()" (modelValueChange)="update('name', $event)" />
      <text-field slim [label]="'Description'" [modelValue]="description()" (modelValueChange)="update('description', $event)" />
    } @else {
      <span>Create a section to begin</span>
    }
  `,
  imports: [DropdownComponent, TextFieldComponent, CommonModule, ReactiveFormsModule],
})
export class SectionGeneralComponent {
  private _sectionService = inject(SectionService);
  protected name = linkedSignal(() => this._sectionService.currentSection()?.name ?? '');
  protected description = linkedSignal(() => this._sectionService.currentSection()?.description ?? '');
  protected sectionList = computed<SelectorItem[]>(() =>
    Array.from(this._sectionService.sections().values()).map(s => ({ label: s.name, id: s.id }))
  );

  protected sectionControl = new FormControl<ExtendedArray<SectionId>>(extendedArray<SectionId>());
  protected selected = linkedSignal<SectionId | null>(() => {
    const section = this._sectionService.currentSection();
    return section ? section.id : null;
  });

  protected updateSelection(selected: SectionId | null) {
    this._sectionService.section.set(selected ?? '');
  }

  protected update(key: keyof Section, value: string | number) {
    this._sectionService.section.update(key, value);
  }

  constructor() {
    effect(() => {
      const id = this.selected();
      this.sectionControl.setValue(id ? extendedArray([id]) : null);
    });
  }
}
