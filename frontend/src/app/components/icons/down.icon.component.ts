import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'check-icon',
  template: `
    <svg viewBox="0 0 24 24" class="check icn" stroke-linecap="round">
      <path d="M6 9, 12 15, 18 9, 19 10,12 17, 5 10Z" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DownIconComponent {}
