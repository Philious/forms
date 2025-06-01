import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputLayoutComponent } from '../../components/action/input.layout.component';

@Component({
  selector: 'current-question',
  host: {
    list: '',
  },
  template: `
    @let control = currentQuestion();
    <h2 class="h2">Question</h2>
    @if (control) {
      <input-layout>
        <input input base-input [formControl]="control" />
      </input-layout>
    }
  `,
  styles: '',
  imports: [ReactiveFormsModule, InputLayoutComponent],
})
export class CurrentQuestionsComponent {
  currentQuestion = input(null, {
    transform: createControl,
  });
}

function createControl(value: string): FormControl<string | null> {
  return new FormControl(value);
}
