import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { SectionService } from 'src/services/section.service';
import { IconEnum } from '../../../helpers/enum';
import { Option } from '../../../helpers/types';
import { IconButtonComponent } from '../../components/action/iconButton.component';
import { ContextMenuComponent } from '../../components/modals/contextMenu.component';
import { AddSectionDialogComponent } from './addSectionDialog.component';

@Component({
  selector: 'section-head',
  template: `
    <h1 class="h1">Section details</h1>
    <div class="options">
      <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
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
      .can-save {
        position: relative;
        color: hsla(0, 0%, 100%, 0.75);
        &:before {
          inset: 4px 4px 6px;
          content: '';
          position: absolute;

          background-color: var(--p-400);
          filter: drop-shadow(0px 0px 1px white);
        }
      }
    }
  `,
})
export class SectionHeadComponent {
  IconEnum = IconEnum;
  sectionService = inject(SectionService);
  canSave = this.sectionService.canSave;
  dialog = inject(Dialog);

  sectionOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];

  addSection(): void {
    this.dialog.open<string>(AddSectionDialogComponent, {
      data: {
        initialName: `Section ${this.sectionService.sections().size + 1}`,
        addSection: this.sectionService.section.add,
      },
    });
  }
  save() {
    this.sectionService.section.save();
    this.sectionService.question.save();
  }
}
