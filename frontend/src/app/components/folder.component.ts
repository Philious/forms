import { Component, inject, input, signal } from '@angular/core';
import { IconEnum } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { LocaleService } from '../services/locale.service';
import { IconComponent } from './icons/icon.component';

export type TreeNode = {
  id: string;
  label: Translation;
  children?: TreeNode[];
};

@Component({
  selector: 'tree-node',
  template: `
    @for (node of nodes(); track node.id) {
      <div class="item-wrapper">
        <button
          class="item"
          [class.has-children]="node.children?.length"
          (click)="toggleFold()"
          [class.open]="isOpen()"
          animate.enter="'enter'"
          animate.leave="'leave'"
        >
          <icon class="icon" [icon]="IconEnum.Down" />
          <span class="label">{{ localeService.translate(node.label) }}</span>
        </button>
        @if (isOpen() && node.children) {
          <tree-node class="nested" [nodes]="node.children" />
        }
      </div>
    }
  `,
  styles: `
    :host {
      width: 100%;
      &.nested {
        padding-left: 1rem;
      }
    }
    .item-wrapper {
      display: grid;
    }
    .item {
      cursor: pointer;
      padding: 0;
      font-size: 0.875rem;

      display: flex;
      background-color: transparent;
      border: none;
      align-items: center;
      gap: 0.5rem;
      transition:
        background-color 0.25s,
        opacity 0.25s,
        height 0.25s;
      &:hover {
        color: var(--p-500);
        background-color: hsla(0, 0%, 100%, 0.03);
      }
      &.enter {
        @starting-style {
          height: 0;
          opacity: 0;
        }
        height: 2rem;
        opacity: 1;
      }
      &.leave {
        @starting-style {
          height: 2rem;
          opacity: 1;
        }
        height: 0;
        opacity: 0;
      }
    }
    .item.open .icon {
      transform: rotate(0);
    }
    .icon {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      transform: rotate(-90deg);
      transition: transform 0.25s;
    }
    .label {
      white-space: pre-wrap;
    }
  `,
  imports: [IconComponent],
})
export class TreeComponent {
  IconEnum = IconEnum;
  localeService = inject(LocaleService);
  nodes = input.required<TreeNode[]>();

  isOpen = signal<boolean>(false);

  toggleFold() {
    this.isOpen.update(o => !o);
  }
}
