import { Component, input, model, output } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'switch',
  imports: [FormsModule],
  template: `
    <label class="label" [for]="switchId()">
      {{label()}}
    </label>
    <div class="wrapper" >
    <input class="input" [id]="switchId()" type="checkbox" [(ngModel)]="isChecked" (change)="onChange.emit(isChecked())"/>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      gap: .5rem;
      height: 3rem;
      align-items:center;
    }
    .label {  }
    .wrapper {
      position: relative;
      width: 2.5rem;
      height: 1.5rem;
      border-radius: 9rem;
      background-color: light-dark(#00000011, #ffffff11);
      box-shadow: 0 0 0 0.0625rem light-dark(#00000088, #ffffff88);
      &:before {
        content: "";
        display: block;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 9rem;
        transform: translateX(0);
        transition: transform .25s;
        background-color: #ffffffdd;
        box-shadow: 0 0.0313rem 0.0625rem #00000044, 0 0.0625rem 0.125rem #00000044;
      }
      &:has(:checked){
        background-color: light-dark(#00000088, #ffffff88);
        &:before { transform: translateX(1rem); }
      }
    }
    .input {
      inset: 0;
      position: absolute;
      opacity: 0;
    }
  `
})
export class Switch {
  switchId = input('uuu');
  isChecked = model<boolean>(false);
  label = input('');

  onChange = output<boolean>();
}