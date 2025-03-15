import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  template: `
  <div class="input-container" [class]="['type', {'pre-icon': preIcon, 'post-icon': postIcon}, state]">
    <label class="label" [for]="inputId" >{{ label }}</label>
    <div class="input-wrapper">
      @if (preIcon) {
        <icon [icon]="preIcon"/>
      }
      <ng-content />
      @if (postIcon) {
        <icon [icon]="postIcon"/>
      }
    </div>
    @if (helpText) {
      <div class="help-text">{{(helpText)}}</div>
    }
  </div>
  `,
  styles: `
    :host {
      width: var(--input-width);
      min-width: 7rem;
    }
    .input-container {
      display: grid;
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text { color: var(--error); }
        .input-wrapper {
          border-color: var(--error);
        }
      }
      .input-wrapper {
        background-color: var(--input-bg-clr);
        box-shadow: 0 0 0 0.0625rem var(--input-border) inset;
        color: var(--input-clr);
        border-radius: 0.125rem;
        height: 2.25rem;
        width: 100%;
        display: grid;
        gap: .25rem; 
        box-sizing: border-box;
        position: relative;
        transition: border-color .15s;
      }
      .label,
      .help-text {
        &:empty { display: none; }
        color: var(--label);
        font-size: var(--txt-small);
        line-height: 1.2;
      }
      &.pre-icon { padding-left: 2.5rem; }
      &.post-icon { padding-right: 2.5rem; }
    }
  `
})

export class InputLayoutComponent {
  InputState = InputState;
  @Input() inputId!: string;
  @Input() type: string = 'text';
  @Input() state = InputState.Default;
  @Input() helpText: string = '';
  @Input() label?: string;
  @Input() preIcon?: IconEnum;
  @Input() postIcon?: IconEnum;

}