import { Component } from "@angular/core";

@Component({
  selector: 'arrow-left-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      class="arrow arrowLeft icn"
      transform="rotate(180)"
    >
      <path d="M14 16L20 12L14 8V11H4V13H14V16Z"  />
   </svg>
  `
})

export class ArrowLeftIconComponent { }