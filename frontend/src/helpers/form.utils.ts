import { ValidationErrors } from '@angular/forms';
import { Division, Entry, EntryTypeEnum, Form, Page } from '@cs-forms/shared';
import { OptionProps } from '@src/app/components/action/aria-drop.component';
import { v4 as uid } from 'uuid';
import { Locale, noTranslation } from './enum';
import { Translation } from './translationTypes';

export function spreadTranslation(trans: Partial<Translation>, transKey?: string): Translation {
  return {
    [Locale.SV]: '',
    [Locale.EN]: '',
    [Locale.NB]: '',
    ...trans,
    [Locale.XX]: transKey || trans?.translationKey || '',
  };
}

export function newForm(form: Partial<Form<'array'>>): Form<'array'> {
  return {
    id: form.id ?? uid(),
    label: form.label ?? spreadTranslation({}),
    pages: form.pages ?? [],
    divisions: form.divisions ?? [],
    entries: form.entries ?? [],
    updated: form.updated ?? new Date().valueOf(),
  };
}

export function newPage(page: Partial<Page<'array'>>): Page<'array'> {
  return {
    id: page.id ?? uid(),
    label: page.label ?? spreadTranslation({}),
    divisions: page.divisions ?? [],
    entries: page.entries ?? [],
    updated: page.updated ?? new Date().valueOf(),
  };
}

export function newDivision(page: Partial<Division<'array'>>): Division<'array'> {
  return {
    id: page.id ?? uid(),
    label: page.label ?? spreadTranslation({}),
    entries: page.entries ?? [],
    updated: page.updated ?? new Date().valueOf(),
  };
}

export function newEntry<T extends EntryTypeEnum>(entry?: Partial<Entry<T>>): Partial<Entry> & Pick<Entry, 'id' | 'label' | 'updated'> {
  return {
    id: entry?.id ?? uid(),
    label: entry?.label || spreadTranslation({}),
    updated: entry?.updated || new Date().valueOf(),
    ...(entry ?? []),
  };
}

type Filters = {
  pages?: string[];
  divisions?: string[];
  entries?: string[];
  label: Translation;
  id: string;
};

export function itemOptions<T extends Filters>(
  items: Record<string, T>,
  translate: (set: Translation) => string,
  filter?: Omit<Filters, 'id' | 'label'>
): OptionProps<T>[] {
  const filtered = Object.values<T>(items).filter(
    item => !filter || filter?.pages?.includes(item.id) || filter?.divisions?.includes(item.id) || filter?.entries?.includes(item.id)
  );
  console.log(filtered);
  const options: OptionProps<T>[] = filtered.map(o => ({
    label: !!translate(o?.label) ? () => translate(o?.label) : () => noTranslation,
    value: o.id,
    data: o,
  }));
  options.unshift({ label: () => 'Show All', value: '' } as OptionProps<T>);
  options.forEach(o => console.log(o.label()));
  return options;
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
