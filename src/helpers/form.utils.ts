import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CustomFormControl, TextFieldMetaData } from './types';

export function addMetadata<T extends FormGroup>(
  fg: T,
  meta: Record<keyof Partial<T['controls']>, Partial<TextFieldMetaData>>
) {
  for (const key in fg.controls) {
    const control = fg.get(key) as (FormGroup | FormControl) & {
      metadata: Partial<TextFieldMetaData>;
    };

    if (control && meta[key])
      control['metadata'] = { ...meta[key], formName: key };
  }
  return fg;
}

export function sendControlAs<T extends CustomFormControl>(
  fg: AbstractControl<any, any>,
  control: string
) {
  return fg.get(control)! as T;
}
