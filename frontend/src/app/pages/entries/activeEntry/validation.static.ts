import { SelectorItem } from '@app/app/components/action/dropdown.component';
import { ValidatorsType } from '@app/helpers/types';

export const validatiorOptions: SelectorItem<keyof ValidatorsType>[] = [
  { label: 'Minimum', id: 'min' },
  { label: 'Maximum', id: 'max' },
  { label: 'Required', id: 'required' },
  { label: 'True id required', id: 'requiredTrue' },
  { label: 'Email', id: 'email' },
  { label: 'Minimum length', id: 'minLength' },
  { label: 'Maximum length', id: 'maxLength' },
  { label: 'Pattern', id: 'pattern' },
  { label: 'Null validator', id: 'nullValidator' },
];
