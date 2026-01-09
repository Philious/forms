import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'play-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="play icn">
      <path d="M8.25 19V5L18.75 12L8.25 19Z" />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class PlayIconComponent {}
