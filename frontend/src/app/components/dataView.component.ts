import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  imports: [CommonModule, CdkDrag],
  selector: 'data-view',
  template: `
    <div
      class="container"
      cdkDrag
      [style]="{ top: startPosition().top, right: startPosition().right, bottom: startPosition().bottom, left: startPosition().left }"
    >
      <span>{{ label() }}</span>
      <br />
      {{ data() }}
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
      max-width: 20rem;
      font-size: 0.75rem;
      &,
      &.label {
        white-space: pre;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `,
})
export class DataViewComponent {
  label = input<string>('');
  data = input(null, {
    transform: (obj: object | null) =>
      JSON.stringify(obj ?? '')
        .split(',')
        .join(',\n')
        .split('{')
        .join('{\n')
        .split('}')
        .join('\n}\n') ?? null,
  });
  startPosition = input<{ top?: string; right?: string; bottom?: string; left?: string }>({
    top: 'initial',
    right: 'initial',
    bottom: 'initial',
    left: 'initial',
  });
}
