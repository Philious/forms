import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { CommonModule } from "@angular/common";
import { ButtonStyleEnum, IconEnum } from "../../../helpers/enum";

@Component({
  selector: 'icon-button',
  imports: [IconComponent, CommonModule],
  template: `
    <div [ngClass]="['bg', buttonStyle]">
      <button class="icn-btn" (click)="onButtonClick($event)" [type]="type" base-input>
        <icon [icon]="icon" class="icn"/>
      </button>
    </div>
    
  `,
  styles: `
    .bg {
      width: 2rem;
      height: 2rem;
      margin: .125rem;
      border-radius: 50%;
      position: relative;
      &:before {
        content: "";
        border-radius: 50%;
        position: absolute;
        inset: 0;
        background-color: transparent;
        transition: background-color .15s;
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
      inset: -.5rem;
      display: grid;
      place-items: center;
    }
  `
})

export class IconButtonComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  @Input() type = 'button';
  @Input() icon!: IconEnum;
  @Input() buttonStyle = ButtonStyleEnum.Transparent;

  @Output() onClick = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent): void {
    this.onClick.emit(event);
  }
}