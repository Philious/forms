import { Component, model } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { JsonPipe } from '@angular/common';
import { IconEnum } from '@app/helpers/enum';
import { InputLayoutComponent } from '../components/action/input-layout/input.layout.component';
import { minLength } from '../components/action/input-layout/input.utils';

@Component({
  selector: 'test-page',
  imports: [FormsModule, InputLayoutComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <button (click)="toggleDisabled()">Toggle disabled</button>
    <input-layout [label]="'Text field'" [contextMessage]="'Context message'" [control]="control" [controlElement]="input">
      <input [formControl]="control" #input />
    </input-layout>
    <div style="position: absolute;">
      Prestine: {{ this.control.pristine }}<br />
      Dirty: {{ this.control.dirty }}<br />
      Touched: {{ this.control.touched }}<br />
      Errors: {{ this.control.invalid }} Errors: {{ this.control.errors | json }}
    </div>
    <input-layout [label]="'Selector'" [contextMessage]="'Context message'" [sufix]="IconEnum.Down" [control]="control2" [controlElement]="input">
      <select [(value)]="modelText" #input>
        <option value="item1">item 1</option>
        <option value="item2">item 2</option>
        <option value="item2">item 3</option>
      </select>
    </input-layout>
  `,
  styles: `
    :host {
      display: grid;
      gap: 4rem;
      background-color: var(--n-200);
      border-radius: 0.25rem;
      place-content: center;
      height: calc(100vh - 3.5rem);
    }
  `,
})
export class TestPageComponent {
  protected control = new FormControl(null, {
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(8)],
    nonNullable: true,
  });
  protected control2 = new FormControl();
  modelText = model<string>('');
  minLength = minLength;
  IconEnum = IconEnum;
  protected toggleDisabled() {
    if (this.control.disabled) this.control.enable();
    else this.control.disable();
  }
}
