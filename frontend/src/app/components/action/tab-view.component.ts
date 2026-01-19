import { CommonModule } from '@angular/common';
import { Component, input, model, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'tab-view',
  imports: [CommonModule],
  template: `
    <div class="tab-row">
      @for (tab of tabs(); track tab.label) {
        <button class="tab" [class.active]="selected() === tab.label" (click)="updateValue(tab.label)">
          {{ tab.label }}
        </button>
      }
      <ng-content />
    </div>

    @for (tab of tabs(); track tab.label) {
      @if (tab.label === selected()) {
        <ng-template *ngTemplateOutlet="tab.template" />
      }
    }
  `,
  styles: `
    @start-style {
      .active:before,
      .active:after {
        scale: 0;
      }
    }
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
    }
    .tab-row {
      display: flex;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
    }
    .tab {
      border: none;
      background-color: transparent;
      cursor: pointer;
      height: 3rem;
      padding: 0;
      position: relative;
      transition:
        padding 0.25s,
        background-color 0.25s;
      border-radius: 0.25rem 0.25rem 0 0;

      font-weight: 600;
      letter-spacing: 0.025rem;
      &:hover {
        color: var(--white);
      }
      &.active {
        padding: 0 1rem;
        background-color: var(--lvl-2);
        --dim: 1rem;

        &:before,
        &:after {
          content: '';
          animation: scale-in 0.25s 0.125s forwards;
          display: block;
          position: absolute;
          bottom: 0;
          background-color: var(--n-200);
          clip-path: shape(from 0 0, arc to var(--dim) var(--dim) of var(--dim) ccw, hline to 0, close);
          height: var(--dim);
          width: var(--dim);
          scale: 0 0;
          z-index: 99;
          transition: scale 0.25s;
          transform-origin: left bottom;
        }
        &:before {
          left: 0;
          rotate: 270deg;
        }
        &:after {
          right: calc(var(--dim) * -1);
          height: var(--dim);
          width: var(--dim);
        }
        &:first-child:before {
          rotate: 90deg;
        }
      }
    }
    @keyframes scale-in {
      from {
        scale: 0 0;
      }
      to {
        scale: 1 1;
      }
    }
  `,
})
export class TabViewComponent {
  tabs = input<{ label: string; template: TemplateRef<string> }[]>();
  oneWayBinding = input<boolean>(false);
  selected = model.required<string>();
  update = output<string>();

  updateValue(val: string) {
    console.log(val);
    if (this.oneWayBinding()) {
      this.update.emit(val);
    } else {
      this.selected.set(val);
    }
  }
}
