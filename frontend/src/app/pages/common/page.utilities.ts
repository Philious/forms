import { computed, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { Translation } from '@src/helpers/translationTypes';
import { ExtendedObjectType } from '@src/helpers/utils';
import { OptionProps } from '../../components/action/aria-drop.component';
import { ListItem } from '../../components/reorerableList.component';
import { ApiObserverOptions } from '../../services/helpers';

type Item = {
  id: string;
  label: Translation;
  updated: number;
};

export function mergeListItem(list: ListItem[], item: Item, translate: (set: Translation) => string): ListItem[] {
  return [
    ...list,
    {
      id: item.id,
      label: translate(item.label),
      selected: true,
    },
  ];
}

export function clearCurrentifNotSaved<T extends Record<'id', string>>(
  current: WritableSignal<T | null>,
  list: ExtendedObjectType<string, T> | null
) {
  if (list && Object.values<T>(list).find(item => item.id === current()?.id)) return;
  else current.set(null);
}

export const updateSelectedAriaOptionFn =
  <T>(options: Signal<OptionProps<T>[]>, current: WritableSignal<T | null>) =>
  (event: string[]) => {
    current.set(options().find(o => o.value && event.includes(o.value))?.data ?? null);
  };

export const checkIfSaved = <T extends Pick<Item, 'id' | 'updated'>>(
  current: WritableSignal<T | null>,
  fpdeItem: Signal<ExtendedObjectType<string, T> | null>
) => {
  const currentItem = current();
  const lastSaved = fpdeItem()
    ?.values()
    .find(item => item.id === currentItem?.id);

  return !currentItem || (!!lastSaved && !!currentItem && lastSaved.updated === currentItem.updated);
};

export const loadPageFn = <T extends Item>(
  current: WritableSignal<T | null>,
  fpdeItem: Signal<ExtendedObjectType<string, T> | null>,
  translate: (set: Translation) => string,
  storeItem: (item: T) => void,
  postForm: (item: T, options?: ApiObserverOptions<T>) => void
) => {
  const currentSaved = computed<boolean>(() => checkIfSaved(current, fpdeItem));

  const list = linkedSignal<ListItem[]>(() => {
    const listArr = fpdeItem()?.values() ?? [];
    const currentItem = current();

    if (currentItem && listArr.filter(item => item.id === currentItem.id).length === 0) {
      listArr.push(currentItem);
    }
    return listArr.map(item => ({
      id: item.id,
      label: translate(item.label),
      selected: item.id === currentItem?.id,
      color: item.id === currentItem?.id && !currentSaved() ? { color: 'var(--p-500)', message: 'Form is not saved' } : undefined,
    }));
  });

  const updateSelected = (id: string | null) => {
    const list = fpdeItem();
    if (list && id && list[id]) {
      const item = list[id];

      current.set(item);
    }
  };

  const save = () => {
    const item = current();
    if (item) {
      postForm(item);
      storeItem(item);
    }
  };

  const updateLabel = (translation: Translation) => {
    const trans = translation;

    current.update(currentItem => {
      currentItem!['label'] = trans;
      currentItem!['updated'] = new Date().valueOf();
      return { ...currentItem } as T;
    });
  };

  return {
    currentSaved,
    list,
    updateSelected,
    save,
    updateLabel,
  };
};
