import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { IconEnum } from '@src/helpers/enum';
import { IconComponent } from './icons/icon.component';

type ListVM = {
  id: string;
  index: number;
  selected: boolean;
};

@Component({
  imports: [CdkDrag, CdkDragPlaceholder, CdkDropList, IconComponent, CommonModule],
  selector: 'list',
  template: `
    <ul cdkDropList (cdkDropListDropped)="dragItem($event)" class="current-list">
      @for (entry of vm(); track entry.id) {
        <li class="list-item" [class.selected]="entry.selected" cdkDrag [cdkDragData]="entry.index">
          <div class="drag-custom-placeholder current-list-item" *cdkDragPlaceholder></div>

          <div class="drag-icon">
            <icon [icon]="IconEnum.Drag" />
          </div>

          <button btn class="list-btn" (click)="select(entry)">
            {{ findLabelFn()(list()[entry.index]) }}
          </button>
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
export class ListComponent<O extends Record<string, unknown>> {
  IconEnum = IconEnum;
  list = model.required<O[]>();
  findLabelFn = input.required<(item: O) => string>();
  updateSelected = output<O>();

  protected vm = computed<ListVM[]>(() => {
    const selectedId = this.selected();

    return this.list().map((item, index) => {
      const id = `item${item.id ?? index}`;
      return {
        id,
        index,
        selected: id === selectedId,
      };
    });
  });

  protected selected = signal<string>('');
  protected select(entry: ListVM) {
    this.selected.set(entry.id);
    this.updateSelected.emit(this.list()[entry.index]);
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

  constructor() {
    this.list.subscribe(v => console.log(v));
  }
}
