import { v4 as uid } from 'uuid';
import { SelectorItem, SelectorItemWithId } from './dropdown.component';

export function addIds<T>(items: SelectorItem<T>[]): SelectorItemWithId<T>[] {
  return items.map(item => {
    item['id'] = uid();
    return item as SelectorItemWithId<T>;
  });
}
