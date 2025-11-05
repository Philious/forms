import { Component } from '@angular/core';
import { svgCircleAsPath } from 'src/helpers/utils';

@Component({
  selector: 'search-icon',
  template: `
    <svg viewBox="0 0 24 24" class="add icn" stroke="#fff" stroke-linecap="round">
      <path [attr.d]="iconPath" fill="transparent" />
    </svg>
  `,
})
export class SearchIconComponent {
  protected iconPath;
  constructor() {
    this.iconPath = `${svgCircleAsPath(10.5, 10.5, 6.5)}ZM15.5 15.5, 19.5 19.5Z`;
  }
}
