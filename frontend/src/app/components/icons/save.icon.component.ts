import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'save-icon',
  template: `
    <svg viewBox="0 0 24 24" class="save icn">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.1 2c.5 0 .9.5.9 1v18.1c0 .5-.4.8-.9.9H2.9a1 1 0 0 1-.9-.9V3c0-.5.4-1 .9-1H21.1ZM2.5 21c0 .3.2.5.5.5h2V17a2 2 0 0 1 2-2h10.2a2 2 0 0 1 1.8 2v4.5h2c.3 0 .5-.2.5-.5V3c0-.3-.2-.5-.5-.5h-2V11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V2.5H3c-.3 0-.5.2-.5.5v18ZM7 16a1 1 0 0 0-1 1v3c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1H7Zm6.5-.5c1 0 1.5.5 1.5 1.5v4.5h3.5V17c0-1-1-1.5-1.5-1.5h-3.5ZM6.5 9a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1h-8Zm0-2a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11Zm0-2a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11Z"
      />
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SaveIconComponent {}
