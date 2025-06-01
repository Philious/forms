import { Component, computed, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { getErrorMessage } from '../../../helpers/form.utils';

@Component({
  selector: 'input-error',
  template: `
    @if (error()) {
      <div class="error">{{ errorMessage() }}</div>
    }
  `,
  styles: `
    .error {
      font-size: var(--txt-small);
      color: var(--error);
    }
  `,
})
export class InputErrorComponent {
  error = input<ValidationErrors | null>(null);
  errorMessage = computed(() => {
    console.log('error update');
    return getErrorMessage(this.error());
  });
}
