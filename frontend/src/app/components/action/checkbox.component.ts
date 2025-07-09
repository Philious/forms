import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

let uid = 0;

@Component({
  selector: 'check-box',
  imports: [FormsModule],
  template: `
    <svg class="check-svg"><path class="check-path" /></svg>
    <input class="input" [id]="id()" type="checkbox" [(ngModel)]="modelValue" (ngModelChange)="update($event)" />
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      position: relative;
      cursor: pointer;
      align-items: center;
      height: 1.5rem;
      width: 1.5rem;
      border-radius: 0.25rem;
      transition: box-shadow 0.25s;
      box-shadow: 0 0 0 0.0938rem light-dark(#00000088, #ffffff88) inset;
      background-color: light-dark(#00000011, #ffffff11);

      &[slim] {
        transform: scale(0.66667);
        .check-path {
          stroke-width: 2;
        }
      }
      &:has(:checked) {
        box-shadow: 0 0 0 0.75rem light-dark(#00000088, var(--p-400)) inset;
        .check-path {
          transition:
            d 0.25s,
            opacity 0 0 box-shadow 3.25s;
          opacity: 1;
          d: path('M2 8, 6 12, 14 4');
        }
      }
      &:hover .wrapper:before {
        background-color: #fffffffa;
      }

      .check-svg {
        width: 1rem;
        height: 1rem;
      }
      .check-path {
        transition:
          d 0.25s,
          opacity 0.25s;
        fill: transparent;
        stroke: light-dark(var(--p-200), #fff);
        stroke-width: 1.5;
        d: path('M8 8, 8 8, 8 8');
      }
    }

    .checkbox {
      width: 2.5rem;
      height: 1.5rem;
      border-radius: 9rem;

      transition:
        background-color 0.25s,
        box-shadow 0.25s;

      background-color: light-dark(#00000088, var(--p-400));
      box-shadow: 0 0 0 0.0625rem light-dark(#00000088, var(--p-200));
    }

    .input {
      inset: 0;
      position: absolute;
      opacity: 0;
      margin: 0;
    }
  `,
})
export class CheckboxComponent {
  id = input(`checkbox-${uid++}`);
  modelValue = model<boolean>(false);
  emitUpdate = output<{ id: string; value: boolean }>();
  update(event: boolean) {
    this.emitUpdate.emit({ id: this.id(), value: event });
  }
}
