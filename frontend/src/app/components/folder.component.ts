import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum';
import { TranslationKey, TranslationTree } from '../../helpers/translationTypes';
import { TranslationService } from '../../services/translation.service';
import { AddTranslationKeyDialogLayoutComponent } from '../pages/questions/addTranslationKeyDialog.component';
import { TranslationSetComponent } from '../pages/questions/questionItem.component';
import { IconButtonComponent } from './action/iconButton.component';
import { FolderComponent as DuplicateFoldComponent } from './folder.component';
import { IconComponent } from './icons/icon.component';

@Component({
  selector: 'folder',
  template: `
    <div class="item-wrapper">
      <button class="item" (click)="toggleFold()">
        <icon class="icon" [icon]="IconEnum.Down" [class.open]="isOpen()" />
        <span class="label">{{ title() }}</span>
      </button>
    </div>
    @let fromGroup = translationsFormGroup();
    @if (fromGroup && isOpen()) {
      <translation-set [translationformGroup]="fromGroup" />
    } @else {
      <ul class="list">
        @if (foldData() && isOpen() && !translationsFormGroup()) {
          @for (d of foldData() | keyvalue; let idx = $index; track d) {
            <li class="list-item">
              <folder [data]="d.value" [title]="d.key" [parent]="parentLink()" (state)="updateChildState($event)" />
            </li>
          }
          @if (!childState()) {
            <li class="list-item add">
              <icon-button [icon]="IconEnum.Add" (clicked)="addTranslationDialog()" [buttonStyle]="ButtonStyleEnum.Border" />
            </li>
          }
        }
      </ul>
    }
  `,
  styles: `
    :host {
      width: 100%;
    }
    .list {
      display: flex;
      flex-direction: column;
    }
    .list-item {
      font-size: 0.875rem;
      margin-left: 1rem;
      order: 1;
      &.last {
        margin-left: 2rem;
        order: 2;
      }
    }
    .add {
      margin: 0.5rem 3rem 1.5rem;
    }
    .item-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item {
      cursor: pointer;
      font-size: 0.875rem;
      display: flex;
      background-color: transparent;
      border: none;
      align-items: center;
      gap: 0.5rem;
      &:hover {
        color: var(--p-500);
      }
    }
    .icon {
      transform: rotate(-90deg);
      transition: transform 0.25s;
      &.open {
        transform: rotate(0);
      }
    }
  `,
  imports: [DuplicateFoldComponent, IconComponent, CommonModule, TranslationSetComponent, IconButtonComponent],
})
export class FolderComponent {
  translationService = inject(TranslationService);
  dialog = inject(Dialog);
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  title = input<string>();
  parent = input<string>('');
  parentLink = computed<string>(() => `${this.parent()}.${this.title()}`.replace(/(^[.])|(?:root)|(?:root.)/gm, ''));
  data = input.required<TranslationTree | string>();

  isOpen = signal<boolean>(false);
  childState = signal<number>(0);
  state = output<boolean>();

  foldData = computed(() => (typeof this.data() === 'object' ? (this.data() as TranslationTree) : null));
  translationsFormGroup = computed(() => {
    if (typeof Object.values(this.data())[0] === 'string') {
      const translationsKey = Object.values(this.data())[0] as TranslationKey;
      const formGroup = this.translationService.getLanguageFormGroup(translationsKey);
      return formGroup ?? null;
    }
    return null;
  });

  toggleFold() {
    this.isOpen.update(curr => !curr);
    console.log(this.title(), this.data());
    this.state.emit(this.isOpen());
  }

  isString(value: unknown) {
    return value as unknown as string;
  }

  updateChildState(isOpen: boolean) {
    this.childState.update(update => {
      if (isOpen) update++;
      else update--;

      return update;
    });
  }

  addTranslationDialog() {
    this.dialog.open(AddTranslationKeyDialogLayoutComponent, {
      minWidth: '20rem',
      data: { link: this.parentLink() },
    });
  }
}
