import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'tab-view',
  imports: [CommonModule],
  template: `
    @for (tab of tabs(); track tab.value) {
      <button class="tab" [class.active]="selected() === tab.value" (click)="onTabClick(tab.value)" text-btn>
        {{ tab.label }}
      </button>
    }
  `,
  styles: `
    :host {
      display: flex;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
    }
    .tab {
      height: 3rem;
      padding: 0;
      position: relative;
      transition: padding 0.25s;
      border-radius: 0.25rem 0.25rem 0 0;
      &.active {
        padding: 0 1rem;
        background-color: var(--n-200);
        &:before,
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          height: 0.25rem;
          width: 0.25rem;
          background-color: var(--n-200);
        }
        &:before {
          left: -0.25rem;
          mask: radial-gradient(4px at 0 0, #0000 98%, #000);
        }
        &:after {
          right: -0.25rem;
          mask: radial-gradient(4px at 100% 0, #0000 98%, #000);
        }
      }
    }
  `,
})
export class TabViewComponent {
  tabs = input<{ label: string; value: string }[]>([]);
  selected = model<string | null>(null);
  selectedEmitter = output<string>();

  onTabClick(value: string) {
    this.selectedEmitter.emit(value);
    this.selected.set(value);
  }
}
