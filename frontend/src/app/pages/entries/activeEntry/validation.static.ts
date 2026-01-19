import { OptionProps } from '@src/app/components/action/aria-drop.component';
import { ValidatorsType } from '@src/helpers/types';

export const validatiorOptions: OptionProps<ValidatorsType[keyof ValidatorsType]>[] = [
  { label: () => 'Minimum', value: 'min' },
  { label: () => 'Maximum', value: 'max' },
  { label: () => 'Required', value: 'required' },
  { label: () => 'True id required', value: 'requiredTrue' },
  { label: () => 'Email', value: 'email' },
  { label: () => 'Minimum length', value: 'minLength' },
  { label: () => 'Maximum length', value: 'maxLength' },
  { label: () => 'Pattern', value: 'pattern' },
  { label: () => 'Null validator', value: 'nullValidator' },
];
