import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'tab-view',
  imports: [CommonModule],
  template: `
    <button class="tab" [class.active]="selected() === i" *ngFor="let tab of tabs; index as i" (click)="onTabClick(tab.value)" text-btn>
      {{ tab.label }}
    </button>
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
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left:0;
        height: 0.125rem;
        width: 100%;
        background-color: lightblue;
        transform: scaleY(0);
        transition: transform .5s;
      }
      &.active:after { transform: scaleY(1); }
    }
  `,
})
export class TabViewComponent {
  @Input() tabs: { label: string; value: string }[] = [];
  @Output() tabSelect = new EventEmitter<string>();

  selected = signal(0)

  onTabClick(value: string) {
    this.tabSelect.emit(value);
    this.selected.set(this.tabs.findIndex(t => t.value === value))
  }
}
