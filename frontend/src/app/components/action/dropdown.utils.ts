import { v4 as uid } from 'uuid';
import { SelectorItem, SelectorItemWithId } from './dropdown.component';

export function addIds<T>(items: SelectorItem<T>[]): SelectorItemWithId<T>[] {
  return items.map(item => {
    return { id: uid(), label: item.label ?? item, value: (item.value ?? item) as T };
  });
}
