import { JsonPipe } from '@angular/common';
import { Component, model } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlInputLayoutComponent } from '@app/components/action/input-layout/controls-input.layout.component';
import { minLength } from '@app/components/action/input-layout/input.utils';
import { IconEnum } from '@src/helpers/enum';

@Component({
  selector: 'test-page',
  imports: [FormsModule, ControlInputLayoutComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <button (click)="toggleDisabled()">Toggle disabled</button>
    <control-input-layout [label]="'Text field'" [contextMessage]="'Context message'" [control]="control" [controlElement]="input">
      <input [formControl]="control" #input />
    </control-input-layout>
    <div style="position: absolute;">
      Prestine: {{ this.control.pristine }}<br />
      Dirty: {{ this.control.dirty }}<br />
      Touched: {{ this.control.touched }}<br />
      Errors: {{ this.control.invalid }} Errors: {{ this.control.errors | json }}
    </div>
    <control-input-layout
      [label]="'Selector'"
      [contextMessage]="'Context message'"
      [sufix]="IconEnum.Down"
      [control]="control2"
      [controlElement]="input"
    >
      <select [(value)]="modelText" #input>
        <option value="item1">item 1</option>
        <option value="item2">item 2</option>
        <option value="item2">item 3</option>
      </select>
    </control-input-layout>
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
