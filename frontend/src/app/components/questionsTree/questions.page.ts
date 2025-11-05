import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { FormTranslation } from '../../../helpers/translationTypes';
import { TranslationService } from '../../../services/translation.service';
import { FolderComponent } from '../../components/folder.component';
import { ToolBarComponent } from '../../components/toolbar.component';

@Component({
  selector: 'questions-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FolderComponent, ToolBarComponent],
  template: `
    <tool-bar [(filter)]="searchFilter" />
    @let translations = translationTree();
    @if (!loading() && translations) {
      <folder [data]="translations" [title]="'root'" (state)="updateChildState($event)" />
    } @else {
      Loading ...
    }
  `,
  styles: `
    ul {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-bottom: 4rem;
    }
    li {
      display: inline-flex;
      gap: 0.25rem;
      align-items: flex-end;
      justify-content: stretch;
    }
    .list-item-add {
      margin: 0.5rem 2rem 1.5rem;
    }
    .folded {
      display: flex;
      .fold-icon {
        transform: rotate(-90deg);
      }
      .question-title {
        display: flex;
        align-items: center;
      }
    }
    .title-wrapper,
    .translation-wrapper {
      display: flex;
      align-items: center;
    }
    .translation-wrapper {
      margin-left: 2.25rem;
    }
    .translation-label {
      margin-right: 0.5rem;
    }
    .text-field {
      flex: 1;
    }
    .open {
      display: grid;
      width: 100%;
      place-items: center stretch;
      gap: 0.5rem;
    }
  `,
})
export class QuestionsComponent {
  translationService = inject(TranslationService);

  ButtonStyleEnum = ButtonStyleEnum;
  IconEnum = IconEnum;
  loading = this.translationService.loading;
  translationTree = this.translationService.translationTree;
  searchFilter = model('');
  childState = signal<number>(0);
  newQuestionData: FormTranslation | null = null;

  updateChildState(isOpen: boolean): void {
    this.childState.update(update => {
      return isOpen ? update++ : update--;
    });
  }
}
