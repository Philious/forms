import { Component, input, output } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'text-button',
  host: {
    role: 'button',
    class: 'btn',
    '[class]': 'buttonStyle()',
    '[style]': `{'font-size': size()}`,
    '(click)': 'onClickButton($event)',
  },
  template: `
    @let left = leftIcon();
    @let right = rightIcon();
    @if (left) {
      <icon class="icon-left" [icon]="left" />
    }
    <span class="label">{{ label() }}</span>
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
      height: 2.25em;
      padding: 0 1em;
      min-width: 5em;
      color: var(--btn-clr);
      border-radius: 0.25em;
      border: none;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 0.25rem;

      .label {
        font-size: 1em;
      }
      &.transparent {
        background-color: transparent;
      }
      &.filled {
        background-color: var(--btn-bg-clr);
      }
      &:has(.icon-left) {
        padding-left: 0.35em;
      }
      &:has(.icon-right) {
        padding-right: 0.35em;
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
  size = input<string>('1rem');
  buttonStyle = input<ButtonStyleEnum>(ButtonStyleEnum.Transparent);
  leftIcon = input<IconEnum | null>(null);
  rightIcon = input<IconEnum | null>(null);
  clicked = output<MouseEvent>();

  IconEnum = IconEnum;
  onClickButton(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
