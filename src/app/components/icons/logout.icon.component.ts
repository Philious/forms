import { Component } from "@angular/core";

@Component({
  selector: 'logout-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      class="logout icn"
      transform="translate(4 0)"
    >
      <path d="M16 16L22 12L16 8V11H6V13H16V16ZM2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V6H12V4L4 4V20H12V18H14V20C14 21.1046 13.1046 22 12 22H4C2.89543 22 2 21.1046 2 20V4Z" />
    </svg>
  `
})

export class LogoutIconComponent { }