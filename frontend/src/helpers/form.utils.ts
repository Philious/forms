import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

type MetaData = {
  formName: string;
} & Record<string, string | number>;
type CustomFormControl<T> = FormControl<T> & { metadata: MetaData };

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

export function getErrorMessage(errors: ValidationErrors | null): string | null {
  if (!errors) return null;

  if (errors['required']) {
    return 'This field is required.';
  }

  if (errors['minlength']) {
    return `Minimum length is ${errors['minlength'].requiredLength} characters.`;
  }

  if (errors['maxlength']) {
    return `Maximum length is ${errors['maxlength'].requiredLength} characters.`;
  }

  if (errors['email']) {
    return 'Please enter a valid email address.';
  }

  // Fallback
  return 'Invalid input.';
}
