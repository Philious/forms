import { Dialog } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QuestionId } from '@cs-forms/shared';
import { IconEnum } from '../../../helpers/enum';
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
    @if (currentSection()) {
      <text-button class="add-new" [leftIcon]="IconEnum.Add" [label]="'New question'" (clicked)="addQuestion()" size=".75rem" />

      @if (questionLists()) {
        <ul cdkDropList (cdkDropListDropped)="dragDropQuestion($event)" class="current-question-list">
          @for (question of questionLists(); track question.id) {
            <li cdkDrag>
              <div class="drag-custom-placeholder current-question-list-item" *cdkDragPlaceholder>
                <icon class="drag-icon" [icon]="IconEnum.Drag" />
              </div>
              <div class="current-question-list-item">
                <div class="drag-icon">
                  <icon [icon]="IconEnum.Drag" />
                </div>
                <button btn class="list-btn" (click)="setQuestionId(question.id)">{{ question.entry }}</button>
              </div>
            </li>
          }
        </ul>
      }
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
        &:hover {
        }
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

  private _sectionService = inject(SectionService);
  private _dialog = inject(Dialog);
  protected currentSection = this._sectionService.currentSection;
  protected questionLists = this._sectionService.currentSectionQuestions;

  constructor() {}

  dragDropQuestion = (event: CdkDragDrop<string, string>) => {
    const previousIndex = this.questionLists()
      .map(q => q.id)
      .findIndex(d => d === event.item.data);
    const currentIndex = event.currentIndex;
    if (previousIndex && currentIndex) {
      this._sectionService.question.updateOrder(previousIndex, currentIndex);
    }
  };

  setQuestionId(id: QuestionId) {
    this._sectionService.question.set(id);
  }

  addQuestion = (): void => {
    this._dialog.open<string>(AddQuestionDialogComponent, {
      data: {
        initialName: `Question ${(this._sectionService.questions().size ?? 0) + 1}`,
        addQuestion: (name: string) => this._sectionService.question.add(name),
      },
    });
  };
}
