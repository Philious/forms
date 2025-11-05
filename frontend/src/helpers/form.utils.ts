import { ValidationErrors } from '@angular/forms';
import { Entry, EntryTypeEnum } from '@cs-forms/shared';
import { v4 as uid } from 'uuid';

export function newEntry(entry: Partial<Entry>): Entry {
  return {
    id: entry.id || uid(),
    type: EntryTypeEnum.RadioGroup,
    label: '',
    updated: NaN,
    ...entry,
  };
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
