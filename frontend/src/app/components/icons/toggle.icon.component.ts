import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'toggle-icon',
  template: `
    <svg viewBox="0 0 24 24" stroke="currentColor" class="add icn">
      <path d="M7 15H18M18 15L15 12M18 15L15 18M17 9L6 9M6 9L9 12M6 9L9 6" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ToggleIconComponent {}
