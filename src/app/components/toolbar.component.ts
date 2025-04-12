import { CommonModule } from '@angular/common';
import { Component, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputLayoutComponent } from './action/input.layout.component';

@Component({
  selector: 'tool-bar',
  template: `
    <div class="tool-bar">
      <input-layout class="search">
        <input
          type="search"
          [(ngModel)]="filter"
          placeholder="Search..."
          base-input
          input
        />
      </input-layout>
    </div>
  `,
  imports: [
    InputLayoutComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  styles: `
    .tool-bar {
      background-color: var(--black);
      display: flex;
      position: sticky;
      top: 4.5rem;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem 0;
      justify-content: space-between;
      z-index: 1;
      .search { --input-width: 100%; }
      box-shadow: 0 2px 4px #000,
        0 4px 8px #000,
        0 8px 16px #000,
        0 16px 32px #000,
    }
  `,
})
export class ToolBarComponent {
  filter = model<string>();
  add = output();
}
