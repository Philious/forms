import { Component, input, output } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'text-button',
  host: {
    role: 'button',
    class: 'btn',
    '[class]': 'buttonStyle()',
    '(click)': 'onClickButton($event)',
  },
  template: `
    @let left = leftIcon();
    @let right = rightIcon();
    @if (left) {
      <icon class="icon-left" [icon]="left" />
    }
    {{ label() }}
    @if (right) {
      <icon class="icon-right" [icon]="right" />
    }
  `,
  imports: [IconComponent],
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      justify-content: center;
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
      &:has(.icon-left) {
        padding-left: 0.35rem;
      }
      &:has(.icon-right) {
        padding-right: 0.35rem;
      }
      &:before {
        content: '';
        opacity: 0;
        background-color: var(--btn-bg-clr);
        position: absolute;
        inset: 0;
        filter: invert(1) contrast(10);
        border-radius: inherit;
      }
      &:after {
        content: '';
        position: absolute;
        inset: -0.25rem 0;
      }
      &:hover:before {
        opacity: 0.1;
      }
      @include media.mobile {
        height: 2.5rem;
      }
      .icon-right {
        margin-left: auto;
      }
    }
  `,
})
export class TextButtonComponent {
  label = input<string>('');

  buttonStyle = input<ButtonStyleEnum>(ButtonStyleEnum.Transparent);
  leftIcon = input<IconEnum | null>(null);
  rightIcon = input<IconEnum | null>(null);
  clicked = output<MouseEvent>();

  IconEnum = IconEnum;
  onClickButton(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
