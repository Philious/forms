import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'icon-button',
  imports: [IconComponent, CommonModule],
  template: `
    <div class="bg" [class]="buttonStyle">
      <button class="icn-btn" (click)="emit($event)" [type]="type" base-input>
        <icon [icon]="icon" class="icn" />
      </button>
    </div>
  `,
  styles: `
    .bg {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0.125rem;
      border-radius: 50%;
      position: relative;
      &:before {
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: 0;
        background-color: transparent;
        transition: background-color 0.15s;
      }
      &:hover:before {
        background-color: var(--hover-clr);
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
      border: 1px solid var(--border);
    }
    .icn-btn {
      color: inherit;
      cursor: pointer;
      inset: -0.5rem;
      display: grid;
      place-items: center;
    }
  `,
})
export class IconButtonComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  @Input() type = 'button';
  @Input() icon!: IconEnum;
  @Input() buttonStyle = ButtonStyleEnum.Transparent;

  emit(event: MouseEvent) {
    console.log('emit');
    this.clicked.emit(event);
  }

  clicked = output<MouseEvent>();
}
