import { CommonModule } from '@angular/common';
import { Component, inject, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionService } from 'src/services/section.service';
import { TextButtonComponent } from './action/textButton.component';

@Component({
  selector: 'tool-bar',
  template: `
    <div class="tool-bar">
      <text-button [label]="'Save'" (clicked)="save()" />
    </div>
  `,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextButtonComponent],
  styles: `
    .tool-bar {
      background-color: var(--black);
      display: flex;
      position: sticky;
      top: 4.5rem;
      gap: 1rem;
      justify-content: space-between;
      z-index: 1;
      .search {
        --input-width: 100%;
      }
    }
  `,
})
export class ToolBarComponent {
  sectionService = inject(SectionService);
  filter = model<string>();
  add = output();

  save() {
    this.sectionService.section.save();
  }
}
