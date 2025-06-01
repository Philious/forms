import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  imports: [CommonModule, CdkDrag],
  selector: 'data-view',
  template: `
    <div class="container" cdkDrag>
      <div>{{ label() }}</div>
      {{ data() | json }}
    </div>
  `,
  styles: `
    .container {
      padding: 1.5rem;
      background: #00000099;
      border: 1px solid #333;
      border-radius: 0.25rem;
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      min-width: 10rem;
      min-height: 10rem;
      height: fit-content;
      backdrop-filter: blur(4px);
      z-index: 9999;
    }
  `,
})
export class DataViewComponent {
  label = input<string>('');
  data = input<object | null>(null);
}
