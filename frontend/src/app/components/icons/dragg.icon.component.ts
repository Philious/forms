import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'drag-icon',
  template: `
    <svg viewBox="0 0 24 24" class="add icn">
      <path d="M2 11.5H22V12.5H-22Z M2 7.5H22V8.5H-22Z M2 15.5H22V16.5H-22Z" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DragIconComponent {}
