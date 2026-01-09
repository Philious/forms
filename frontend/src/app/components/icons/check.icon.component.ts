import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'check-icon',
  template: `
    <svg viewBox="0 0 24 24" class="check icn" stroke-linecap="round">
      <path d="M17.6 8L10.5 15L7 11L6 13L10.5 18L18.6 10Z" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CheckIconComponent {}
