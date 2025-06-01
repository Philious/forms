import { Dialog } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Question, QuestionId } from '@cs-forms/shared';
import { Store } from 'src/stores/store';
import { IconEnum } from '../../../helpers/enum';
import { QuestionService } from '../../../services/question.service';
import { SectionService } from '../../../services/section.service';
import { TextButtonComponent } from '../../components/action/textButton.component';
import { IconComponent } from '../../components/icons/icon.component';
import { AddQuestionDialogComponent } from './addQuestionDialog.component';

@Component({
  selector: 'section-question-list',
  imports: [TextButtonComponent, CommonModule, IconComponent, CdkDropList, CdkDrag, CdkDragPlaceholder],
  host: {
    list: '',
  },
  template: `
    @let questions = sectionQuestions();
    <text-button class="add-new" [leftIcon]="IconEnum.Add" [label]="'New question'" (clicked)="addQuestion()" />

    @if (questions?.length) {
      <ul cdkDropList (cdkDropListDropped)="dragDropQuestion($event)" class="current-question-list">
        @for (question of questions; track question.id) {
          <li cdkDrag>
            <div class="drag-custom-placeholder current-question-list-item" *cdkDragPlaceholder>
              <icon class="drag-icon" [icon]="IconEnum.Drag" />
            </div>
            <div class="current-question-list-item">
              <div class="drag-icon">
                <icon [icon]="IconEnum.Drag" />
              </div>
              <button btn class="list-btn" (clicked)="setQuestionId(question.id)">{{ question.entry }}</button>
            </div>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    @use 'component.mixins' as mix;
    @include mix.components;
    .add-new {
      margin-right: auto;
    }
    .current-question-list {
      display: grid;
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .current-question-list-item {
      display: flex;
      align-items: center;
      overflow: hidden;
      &.drag-custom-placeholder {
        background-color: orange;
        height: 2.25rem;
        overflow: hidden;
      }
      .drag-icon {
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 0.25rem;
        display: grid;
        place-items: center;
        cursor: grab;
        &:active {
          cursor: grabbing;
        }
        &:hover {
          background-color: hsla(0, 0%, 100%, 0.1);
        }
      }
      .list-btn {
        display: inline-flex;
        padding-inline: 0.5rem;
        flex: 1;
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
      }
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow:
        0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
})
export class SectionQuestionListComponent {
  protected IconEnum = IconEnum;
  private _store = inject(Store);
  private _sectionService = inject(SectionService);
  private _questionService = inject(QuestionService);
  private _dialog = inject(Dialog);
  protected sectionQuestions = signal<Question[]>([]);

  constructor() {
    this._questionService.getQuestionsByCurrentSectionId().subscribe(sectionQuestions => this.sectionQuestions.set(sectionQuestions));
  }

  dragDropQuestion = (event: CdkDragDrop<string, string>) => {
    const previousIndex = this._store.currentSection()?.questions.findIndex(d => d === event.item.data);
    const currentIndex = event.currentIndex;
    if (previousIndex && currentIndex) {
      this._sectionService.updateQuestionListOrder(previousIndex, currentIndex);
    }
  };

  setQuestionId = (id: QuestionId) => {
    this._store.question.setById(id);
  };

  addQuestion(): void {
    this._dialog.open<string>(AddQuestionDialogComponent, {
      data: {
        initialName: `Question ${(this._store.currentSection()?.questions?.length ?? 0) + 1}`,
        addQuestion: this._questionService.add,
      },
    });
  }
}
