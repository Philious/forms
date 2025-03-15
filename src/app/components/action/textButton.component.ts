import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonStyleEnum } from "../../../helpers/enum";

@Component({
  selector: 'text-button',
  template: `
    <button class="btn" [class]="buttonStyle" (click)="onClickButton($event)">
      {{ label }}
    </button>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host { display: contents; }
    .btn {
      height: 2.25rem;
      padding: 0 1rem;
      min-width: 5rem;
      color: var(--btn-clr);
      background-color: var(--btn-bg-clr);
      border-radius: 0.25rem;
      border: none;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 0.25rem;
      &:before {
        content: "";
        opacity: 0;
        background-color: var(--btn-bg-clr);
        position: absolute;
        inset: 0;
        filter: invert(1) contrast(10);
        border-radius: inherit;
      }
      &:after {
        content: "";
        position: absolute;
        inset: -.25rem 0;
      }
      &:hover:before {
        opacity: .1;        
      }
      @include media.mobile {
        height: 2.5rem;
      }
    }
  `
})
export class TextButton {
  @Input() label: string = '';
  @Input() buttonStyle = ButtonStyleEnum.Transparent;
  @Output() onClick = new EventEmitter<Event>();

  onClickButton(event: Event) {
    this.onClick.emit(event)
  }
}