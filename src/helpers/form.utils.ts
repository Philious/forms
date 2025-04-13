import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomFormControl } from './types';

// T Meta
export function addMetadata<T>(fg: FormGroup, meta: Partial<Record<keyof (typeof fg)['controls'], Partial<T>>>) {
  for (const key in fg.controls) {
    const control = fg.get(key) as CustomFormControl<T>;

    if (control && meta[key]) control['metadata'] = { ...meta[key], formName: key };
  }
  return fg as FormGroup<Record<keyof (typeof fg)['controls'], CustomFormControl<T>>>;
}

export function fetchFormGroupAs<O, T = CustomFormControl<O>>(fg: AbstractControl<unknown>, control: string) {
  return fg.get(control)! as T;
}

export function fetchFormArrayAs<O extends string, T = FormArray<FormControl<O>>>(fa: unknown): T {
  return fa! as T;
}

export function fetchFormControlAs<O, T = CustomFormControl<O>>(fc: unknown) {
  return fc! as T;
}
