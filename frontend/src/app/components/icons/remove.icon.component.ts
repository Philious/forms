import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'remove-icon',
  template: `
    <svg viewBox="0 0 24 24" class="remove icn" stroke-linecap="round">
      <path transform="rotate(45)" style="transform-origin: center" d="M13 7H11V11L7 11V13H11V17H13V13H17V11L13 11V7Z" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class RemoveIconComponent {}
