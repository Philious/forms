import { Component, input, model, OnInit } from '@angular/core';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

let uid = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  host: {
    class: 'input-container',
    '[class]': 'type()',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
  },
  template: `
    @let lprefix = prefix(); @let lsufix = sufix(); @let lhelp = helpText();
    <label class="label" [for]="id()">{{ label() }}</label>
    <div class="input-wrapper">
      @if (lprefix) {
      <icon class="prefix" [icon]="lprefix" />
      }
      <ng-content />
      @if (lsufix) {
      <icon class="sufix" [icon]="lsufix" />
      }
    </div>
    @if (lhelp) {
    <div class="help-text">{{ lhelp }}</div>
    }
  `,
  styles: `
    :host {
      width: var(--input-width);
      min-width: 7rem;
      display: grid;
      gap: .25rem; 
      [slim] {
        .input-wrapper {
          height: 2rem;
        }
      }
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text { color: var(--error); }
        .input-wrapper {
          border-color: var(--error);
        }
      }
    }
    .input-wrapper {
      background-color: var(--input-bg-clr);
      box-shadow: 0 0 0 0.0625rem var(--input-border) inset;
      color: var(--input-clr);
      border-radius: 0.125rem;
      height: 2.5rem;
      width: 100%;
      display: grid;
      
      box-sizing: border-box;
      position: relative;
      transition: border-color .15s;
    }
    .prefix,
    .sufix {
      display: grid;
      place-content: center;
      width: 2.5rem;
      height: inherit;
    }
    .sufix {margin-left: auto; }
    .label,
    .help-text {
      &:empty { display: none; }
      color: var(--label);
      font-size: var(--txt-small);
      line-height: 1.2;
    }
      
    
  `,
})
export class InputLayoutComponent implements OnInit {
  protected InputState = InputState;
  id = input(`input-${uid++}`);

  type = input<string>('text');
  helpText = model<string>('');
  label = input<string>('');
  prefix = input<IconEnum>();
  sufix = input<IconEnum>();

  ngOnInit(): void {}
}
