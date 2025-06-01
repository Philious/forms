import { AfterViewInit, Component, contentChild, ElementRef, input, signal } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';
import { InputErrorComponent } from './inputError.component';

let uid = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent, InputErrorComponent],
  host: {
    class: 'input-container',
    '[class]': 'type()',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
  },
  template: `
    @let prefixIcon = prefix(); @let sufixIcon = sufix();
    <label class="label" [for]="id()">{{ label() }}</label>
    <div class="input-wrapper">
      @if (prefixIcon) {
        <icon class="prefix" [icon]="prefixIcon" />
      }
      <ng-content #input />
      @if (sufixIcon) {
        <icon class="sufix" [icon]="sufixIcon" />
      }
    </div>

    @if (error()) {
      <input-error [error]="error()" />
    } @else if (helpText()) {
      <div class="help-text">{{ helpText() }}</div>
    }
  `,
  styles: `
    :host {
      width: var(--input-width, fit-content);
      min-width: 7rem;

      display: grid;
      gap: 0.25rem;
      [slim] {
        .input-wrapper {
          height: 2rem;
        }
      }
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text {
          color: var(--error);
        }
        .input-wrapper {
          border-color: var(--error);
        }
      }
    }
    .input-wrapper {
      background-color: var(--input-bg-clr);
      box-shadow: 0 0 0 0.0625rem var(--input-border) inset;
      color: var(--input-clr);
      border-radius: 0.25rem;
      height: 2.5rem;
      width: 100%;
      min-width: fit-content;
      display: grid;

      box-sizing: border-box;
      position: relative;
      transition: border-color 0.15s;
    }
    .prefix,
    .sufix {
      display: grid;
      place-content: center;
      width: 2.5rem;
      height: inherit;
    }
    .sufix {
      margin-left: auto;
    }
    .label,
    .help-text {
      &:empty {
        display: none;
      }
      color: var(--label);
      font-size: var(--txt-small);
      line-height: 1.2;
    }
  `,
})
export class InputLayoutComponent implements AfterViewInit {
  protected InputState = InputState;
  readonly ngControlRef = contentChild(NgControl);

  id = input(`input-${uid++}`);
  type = input<string>('text');
  helpText = input<string>('');
  label = input<string>('');
  prefix = input<IconEnum>();
  sufix = input<IconEnum>();

  error = signal<ValidationErrors | null>(null);

  constructor(private readonly hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    this.ngControlRef()?.statusChanges?.subscribe(status => {
      this.error.set(status !== 'VALID' ? (this.ngControlRef()?.control?.errors ?? null) : null);
    });

    if (host) host.querySelector('input')?.setAttribute('id', this.id());
  }
}
