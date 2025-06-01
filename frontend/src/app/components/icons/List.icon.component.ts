import { Component } from "@angular/core";

@Component({
  selector: 'list-icon',
  template: `
    <svg
      viewBox="0 0 16 16"
      class="list icn"
    >
      <circle
        cx="2"
        cy="3"
        r="1.5"
      />
      <circle
        cx="2"
        cy="8"
        r="1.5"
      />
      <circle
        cx="2"
        cy="13"
        r="1.5"
      />
      <path d="M6 3H16M6 8H16M6 13H16" />
    </svg>
  `
})

export class ListIconComponent { }