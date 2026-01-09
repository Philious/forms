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
      transition: padding 0.25s;
      border-radius: 0.25rem 0.25rem 0 0;

      font-weight: 600;
      letter-spacing: 0.025rem;
      &:hover {
        color: var(--white);
      }
      &.active {
        padding: 0 1rem;
        background-color: var(--lvl-2);

        &:before,
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          height: 0.5rem;
          width: 0.5rem;
          background-color: var(--n-200);
        }
        &:before {
          left: -0.5rem;
          mask: radial-gradient(0.5rem at 0 0, #0000 98%, #000);
        }
        &:after {
          right: -0.5rem;
          mask: radial-gradient(0.5rem at 100% 0, #0000 98%, #000);
        }
        &:first-child:before {
          transform-origin: right bottom;
          scale: -2 -2;
        }
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
    console.log(this.selected());
  }
}
