import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'icon-button',
  imports: [IconComponent, CommonModule],
  template: `
    <div class="bg" [class]="style()">
      <button class="icn-btn" (click)="emit($event)" [type]="type()" base-input>
        <icon [icon]="icon()" class="icn" />
      </button>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
    }
    .bg {
      width: 2rem;
      height: 2rem;

      border-radius: 50%;
      position: relative;
      &:before {
        content: '';
        border-radius: 0.25rem;
        position: absolute;
        inset: 0;
        background-color: transparent;
        transition: background-color 0.15s;
      }
      &:hover {
        .icn {
          scale: 1.2;
        }

        &:before {
          background-color: var(--hover-clr);
        }
      }
      &:active:before {
        background-color: var(--action-clr);
      }
    }
    .filled {
      background-color: var(--icn-bg-clr);
      color: var(--icn-clr-filled);
    }
    .border {
      box-shadow: 0 0 0 1px inset var(--border);
    }
    .icn-btn {
      color: inherit;
      cursor: pointer;
      inset: -0.5rem;
      display: grid;
      place-items: center;
    }
    .icn {
      transition: scale 0.5s;
    }
  `,
})
export class IconButtonComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  type = input('button');
  icon = input.required<IconEnum>();
  style = input<ButtonStyleEnum>(ButtonStyleEnum.Transparent);

  emit(event: MouseEvent) {
    this.clicked.emit(event);
  }

  clicked = output<MouseEvent>();
}
