import { ValidationErrors } from '@angular/forms';
import { Division, Entry, EntryTypeEnum, Form, Locale, Page } from '@cs-forms/shared';
import { OptionProps } from '@src/app/components/action/aria-drop.component';
import { v4 as uid } from 'uuid';

export function spreadTranslation(trans: string, transKey?: string) {
  return {
    [Locale.SE]: trans,
    [Locale.EN]: trans,
    [Locale.NB]: trans,
    [Locale.XX]: transKey || '',
  };
}

export function newForm(form: Partial<Form<'array'>>): Form<'array'> {
  return {
    id: form.id ?? uid(),
    header: form.header ?? spreadTranslation(''),
    pages: form.pages ?? [],
    divisions: form.divisions ?? [],
    entries: form.entries ?? [],
    updated: form.updated ?? new Date().valueOf(),
  };
}

export function newPage(page: Partial<Page<'array'>>): Page<'array'> {
  return {
    id: page.id ?? uid(),
    header: page.header ?? spreadTranslation(''),
    divisions: page.divisions ?? [],
    entries: page.entries ?? [],
    updated: page.updated ?? new Date().valueOf(),
  };
}

export function newDivision(page: Partial<Division<'array'>>): Division<'array'> {
  return {
    id: page.id ?? uid(),
    header: page.header ?? spreadTranslation(''),
    entries: page.entries ?? [],
    updated: page.updated ?? new Date().valueOf(),
  };
}

export function newEntry<T extends EntryTypeEnum>(entry?: Partial<Entry<T>>): Partial<Entry> & Pick<Entry, 'id' | 'translations' | 'updated'> {
  return {
    id: entry?.id ?? uid(),
    translations: entry?.translations || spreadTranslation(''),
    updated: entry?.updated || new Date().valueOf(),
    ...(entry ?? []),
  };
}

export function itemOptions<T extends Form | Page | Division>(items: Record<string, T>): OptionProps<T>[] {
  return (Object.values(items) as T[]).map(o => ({
    id: Object.hasOwn(o, 'id') ? o?.id : '',
    value: o.header?.['sv-SE'] ?? 'NO NAME',
    data: o as T,
  }));
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
