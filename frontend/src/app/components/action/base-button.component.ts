import { Component, input, output } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'button[base-button]',
  host: {
    role: 'button',
    class: 'btn',
    '[class]': '["action-animation", buttonStyle()]',
    '[class.icon-btn]': 'iconButton()',
    '(click)': 'onClickButton($event)',
  },
  template: `
    @let iconBtn = iconButton();
    @if (iconBtn) {
      <icon class="icon-btn" [icon]="iconBtn" />
    } @else {
      @let left = leftIcon();
      @let right = rightIcon();
      @if (left) {
        <icon class="icon-left" [icon]="left" />
      }
      <ng-content>
        <span class="label">{{ label() }}</span>
      </ng-content>
      @if (right) {
        <icon class="icon-right" [icon]="right" />
      }
    }
  `,
  imports: [IconComponent],
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 1rem;
      justify-content: center;
      height: 2.25em;
      padding: 0 1em;
      min-width: 5em;
      border-radius: 99rem;
      border: none;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;

      .label {
        font-size: inherit;
      }
      &.transparent {
        background-color: transparent;
      }
      &.filled {
        background-color: var(--btn-bg-clr);
      }
      &.icon-btn {
        background-color: transparent;
        padding: 0;
        width: 2em;
        height: 2em;
        min-width: 2em;
        &:before {
          content: initial;
          filter: none;
        }
      }
      &:before {
        content: '';
        display: block;
        opacity: 0;
        color: inherit;
        background-color: currentColor;
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
export class ButtonComponent {
  label = input<string>('');
  size = input<string>('1rem');
  buttonStyle = input<ButtonStyleEnum>(ButtonStyleEnum.Transparent);
  leftIcon = input<IconEnum | null>(null);
  rightIcon = input<IconEnum | null>(null);
  iconButton = input<IconEnum | null>(null);
  clicked = output<MouseEvent>();

  IconEnum = IconEnum;
  onClickButton(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
