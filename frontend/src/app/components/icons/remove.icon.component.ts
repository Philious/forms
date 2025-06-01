import { Component } from "@angular/core";

@Component({
  selector: 'remove-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      class="remove icn"
      stroke-linecap="round"
      transform="rotate(45)"
    >
      <path d="M13 7H11V11L7 11V13H11V17H13V13H17V11L13 11V7Z" />
    </svg>
  `
})

export class RemoveIconComponent { }