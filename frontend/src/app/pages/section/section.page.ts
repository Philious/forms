import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { IconButtonComponent } from '@app/app/components/action/iconButton.component';
import { ContextMenuComponent } from '@app/app/components/modals/contextMenu.component';
import { IconEnum } from '@app/helpers/enum';
import { SectionService } from '@app/services/section.service';
import { Option } from '../../../helpers/types';
import { LayoutComponent } from '../common/layout.component';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent, SelectorItem } from '@app/app/components/action/dropdown.component';
import { InputLayoutComponent } from '@app/app/components/action/input-layout/input.layout.component';
import { TextFieldComponent } from '@app/app/components/action/textfield.component';
import { ExtendedArray } from '@app/helpers/utils';
import { AddSectionDialogComponent } from './addSectionDialog.component';

@Component({
  selector: 'sections-page',
  imports: [
    IconButtonComponent,
    ContextMenuComponent,
    LayoutComponent,
    DropdownComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    InputLayoutComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a section'">
      <span content header>Section details</span>
      <span content header-options>
        <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
        <icon-button [icon]="IconEnum.Add" (clicked)="addSection()" />
        <context-menu [options]="pageHeaderOptions">
          <icon-button [icon]="IconEnum.Options" />
        </context-menu>
        <icon-button [icon]="IconEnum.Play" />
      </span>
      <span content location>
        <input-layout [label]="'Form'" [control]="crtlGrp.controls.section">
          <drop-down slim [items]="formOptions()" slim [formControl]="crtlGrp.controls.section" />
        </input-layout>
        <input-layout [label]="'Page'" [control]="crtlGrp.controls.page">
          <drop-down slim [items]="pageOptions()" slim [formControl]="crtlGrp.controls.page" />
        </input-layout>
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </span>
      <span content list> </span>
      <span content specifics> </span>
    </layout>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
  `,
})
export class SectionComponent {
  protected IconEnum = IconEnum;
  private _sectionService = inject(SectionService);
  protected canSave = this._sectionService.canSave;
  dialog = inject(Dialog);

  protected pageHeaderOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];

  protected formOptions = signal<ExtendedArray<SelectorItem>>(new ExtendedArray());
  protected pageOptions = signal<ExtendedArray<SelectorItem>>(new ExtendedArray());
  protected sectionOptions = signal<ExtendedArray<SelectorItem>>(new ExtendedArray());
  protected crtlGrp = new FormGroup({
    section: new FormControl([]),
    page: new FormControl<ExtendedArray<string>>(new ExtendedArray()),
    form: new FormControl<ExtendedArray<string>>(new ExtendedArray()),
  });

  protected addSection(): void {
    this.dialog.open<string>(AddSectionDialogComponent, {
      data: {
        initialName: `Section ${this._sectionService.sections().size + 1}`,
        addSection: this._sectionService.section.add,
      },
    });
  }

  protected save() {
    this._sectionService.section.save();
    this._sectionService.question.save();
  }
}
