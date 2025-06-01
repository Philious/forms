import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { v4 } from 'uuid';

@Component({
  selector: 'switch',
  imports: [FormsModule],
  template: `
    <label class="label" [for]="switchId()">
      {{ label() }}
    </label>
    <div class="switch">
      <input class="input" [id]="switchId()" type="checkbox" [(ngModel)]="isChecked" (change)="changed.emit(isChecked())" />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      position: relative;
      gap: 0.5rem;
      height: 3rem;
      cursor: pointer;
      align-items: center;
      &[slim] {
        .switch {
          width: 1.25rem;
          height: 0.75rem;
          &:has(:checked):before {
            transform: translateX(0.5rem);
          }
          &:before {
            width: 0.75rem;
            height: 0.75rem;
          }
        }
      }
      &:hover .wrapper:before {
        background-color: #fffffffa;
      }
      * {
        cursor: inherit;
      }
    }
    .label {
      font-size: 0.875rem;
    }
    .switch {
      width: 2.5rem;
      height: 1.5rem;
      border-radius: 9rem;
      background-color: light-dark(#00000011, #ffffff11);
      box-shadow: 0 0 0 0.0625rem light-dark(#00000088, #ffffff88);
      transition:
        background-color 0.25s,
        box-shadow 0.25s;
      &:before {
        content: '';
        display: block;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 9rem;
        transform: translateX(0);
        transition: transform 0.25s;
        background-color: #ffffffdd;
        box-shadow:
          0 0.0313rem 0.0625rem #00000044,
          0 0.0625rem 0.125rem #00000044;
      }
      &:has(:checked) {
        background-color: light-dark(#00000088, var(--p-400));
        box-shadow: 0 0 0 0.0625rem light-dark(#00000088, var(--p-200));

        &:before {
          transform: translateX(1rem);
        }
      }
    }
    .input {
      inset: 0;
      position: absolute;
      opacity: 0;
    }
  `,
})
export class SwitchComponent {
  switchId = input(v4());
  isChecked = model<boolean>(false);
  label = input('');

  changed = output<boolean>();
}
