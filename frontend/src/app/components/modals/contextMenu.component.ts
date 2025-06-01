import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, input, output } from '@angular/core';
import { Option } from '../../../helpers/types';

@Component({
  selector: 'context-menu',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger],
  template: `
    <span [cdkMenuTriggerFor]="menu">
      <ng-content />
    </span>
    <ng-template #menu>
      <div class="menu" cdkMenu>
        @for (option of options(); track option.value) {
          <button class="menu-item" (click)="updateSelected.emit(option.value)" cdkMenuItem>
            {{ option.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    .menu {
      display: grid;
      background-color: var(--n-100);
      border-radius: 0.25rem;
      box-shadow: 0 0 0 0.0625rem var(--n-300);
      @include media.mobile {
      }
    }
    .menu-item {
      background-color: transparent;
      border: none;
      color: var(--n-800);
      height: 2.5rem;
      padding: 0 1.5rem;
      cursor: pointer;
      &:hover {
        background-color: hsla(0, 0%, 100%, 0.1);
      }
      @include media.mobile {
      }
    }
  `,
})
export class ContextMenuComponent {
  options = input.required<Option[]>();
  updateSelected = output<string>();
}
