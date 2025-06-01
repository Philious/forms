import { Component } from "@angular/core";

@Component({
  selector: 'settings-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      class="settings icn"
    >
      <path d="M13 7H11V11L7 11V13H11V17H13V13H17V11L13 11V7Z" />
    </svg>
  `
})

export class SettingsIconComponent { }