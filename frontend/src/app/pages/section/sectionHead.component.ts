import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { SectionService } from '../../../services/section.service';
import { IconButtonComponent } from '../../components/action/iconButton.component';
import { ContextMenuComponent } from '../../components/modals/contextMenu.component';
import { AddSectionDialogComponent } from './addSectionDialog.component';

@Component({
  selector: 'section-head',
  template: `
    <h1 class="h1">Section details</h1>
    <div class="options">
      <icon-button [icon]="IconEnum.Save" (clicked)="saveSection()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="addSection()" />
      <context-menu [options]="sectionOptions">
        <icon-button [icon]="IconEnum.Options" />
      </context-menu>
      <icon-button [icon]="IconEnum.Play" />
    </div>
  `,
  imports: [IconButtonComponent, ContextMenuComponent],
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      .options {
        display: flex;
        gap: 8;
      }
    }
  `,
})
export class SectionHeadComponent {
  IconEnum = IconEnum;
  sectionService = inject(SectionService);
  dialog = inject(Dialog);

  sectionOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];

  addSection(): void {
    this.dialog.open<string>(AddSectionDialogComponent, {
      data: {
        initialName: `Section ${this.sectionService.sectionIds().length + 1}`,
        addSection: this.sectionService.add,
      },
    });
  }
  saveSection() {}
}
