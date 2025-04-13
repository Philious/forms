import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { AnswerTypeEnum } from '../app/pages/section/section.data';
import { IconEnum } from './enum';

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
};

export type Option = actionButton & { icon?: IconEnum };

export type Position = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type CustomFormControl<T> = FormControl & {
  metadata: Partial<T>;
};

export type TextFieldMetaData = {
  label: string;
  type: string;
  prefix: IconEnum;
  sufix: IconEnum;
  helpText: string;
  formName: string;
};

export type QuestionProps = {
  question: CustomFormControl<string>;
  answerType: CustomFormControl<AnswerTypeEnum | null>;
  answers: FormArray<FormControl<string>>;
  validators: CustomFormControl<[]>;
  allows: FormControl<[]>;
};

export type QuestionFormGroup = AbstractControl<QuestionProps>;
