import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Form } from '@cs-forms/shared';
import { AriaDropComponent, OptionProps } from '@src/app/components/action/aria-drop.component';
import { LocaleService } from '@src/app/services/locale.service';
import { Store } from '@src/app/store/store';
import { itemOptions } from '@src/helpers/form.utils';

@Component({
  selector: 'test-page',
  imports: [AriaDropComponent],
  template: ` <aria-drop [items]="formOptions()" [label]="'Form'" [selected]="selectedForm()" (selectedChange)="updateSelected($event)" /> `,
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
  store = inject(Store);
  localeService = inject(LocaleService);
  json = input<JSON>();

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}, this.localeService.translate));
  protected selectedForm = linkedSignal<string[]>(() => {
    const id = this.store.currentForm()?.id;
    return id ? [id] : [];
  });
  protected updateSelected = (id: string[]) => {
    const idString = id.pop();
    const form = idString ? this.store.forms()?.[idString] : null;
    if (id && form) {
      this.store.currentForm.set(form);
    }
  };
}
