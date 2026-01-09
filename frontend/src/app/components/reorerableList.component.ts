import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule, NgStyle } from '@angular/common';
import { Component, model, output } from '@angular/core';
import { IconEnum, noTranslation } from '@src/helpers/enum';
import { TooltipDirective } from '../directives/tooltip.directive';
import { ButtonComponent } from './action/base-button.component';
import { IconComponent } from './icons/icon.component';

export type ListItem = {
  id: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  color?: string | { color: string; message: string };
};

@Component({
  imports: [CdkDrag, CdkDragPlaceholder, CdkDropList, IconComponent, ButtonComponent, CommonModule, NgStyle, TooltipDirective],
  selector: 'list',
  template: `
    <ul cdkDropList (cdkDropListDropped)="dragItem($event)" class="current-list">
      @for (entry of list(); let idx = $index; track entry.id) {
        <li class="list-item" [class.selected]="entry.selected" cdkDrag [cdkDragData]="idx">
          <div class="drag-custom-placeholder current-list-item" *cdkDragPlaceholder></div>
          <div class="drag-icon">
            <icon [icon]="IconEnum.Drag" />
          </div>
          <button btn class="list-btn" (click)="selected.set(entry.id)">{{ entry.label || noTranslation }}</button>

          @if (entry.color) {
            <div
              class="dot"
              [class.message]="!!colorMessage(entry.color).message"
              [tooltip]="colorMessage(entry.color).message"
              [ngStyle]="{ backgroundColor: colorMessage(entry.color).color }"
            ></div>
          }
          <button class="remove-btn" base-button [iconButton]="IconEnum.Remove" (click)="removeId.emit(entry.id)"></button>
        </li>
      }
    </ul>
  `,
  styles: `
    .current-list {
      display: grid;
    }
    .drag-custom-placeholder {
      height: 2.5rem;
      opacity: 0;
      overflow: hidden;
    }
    .dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      margin-right: 0.5rem;
      &.message {
        cursor: help;
      }
    }
    .cdk-drop-list-dragging .list-item {
      &:not(.current-list-item):hover {
        background-color: transparent;
      }
      transition:
        transform 0.25s cubic-bezier(0, 0, 0.2, 1),
        box-shadow 0.25s cubic-bezier(0, 0, 0.2, 1),
        background-color 0.25s;
    }
    .list-item {
      display: flex;
      align-items: center;
      overflow: hidden;
      box-shadow: 0 0 0 transparent;
      border-radius: 0.25rem;
      transition:
        box-shadow 0.25s cubic-bezier(0, 0, 0.2, 1),
        background-color 0.25s;
      &.selected,
      &:hover {
        background-color: hsla(0, 0%, 100%, 0.03);
      }
      &:active {
        background-color: hsla(0, 0%, 100%, 0.06);
        box-shadow:
          0 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2),
          0 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14),
          0 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);
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
      }
      .list-btn {
        display: inline-flex;
        padding-inline: 0.5rem;
        flex: 1;
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        letter-spacing: 0.025rem;
      }
      .remove-btn {
        font-size: 1.5rem;
        flex: 0 0 2.5rem;
        height: 2.5rem;
        min-width: 0;
      }
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      background-color: hsla(0, 0%, 100%, 0.03);
      backdrop-filter: blur(0.5rem);
      border-radius: 0.25rem;
      translate: 0 0 1px;
      box-shadow:
        0 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2),
        0 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14),
        0 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
})
export class ListComponent {
  IconEnum = IconEnum;
  noTranslation = noTranslation;
  list = model.required<ListItem[]>();
  selected = model<ListItem['id'] | null>(null);
  removeId = output<string>();

  colorMessage(value: string | { color: string; message: string }): { color: string; message: string } {
    if (typeof value == 'string') return { color: value, message: '' };
    else return value;
  }

  protected dragItem(event: CdkDragDrop<number>) {
    if (event.previousIndex === event.currentIndex) return;

    this.list.update(order => {
      const copy = [...order];
      const [moved] = copy.splice(event.previousIndex, 1);
      copy.splice(event.currentIndex, 0, moved);
      return copy;
    });
  }
}
