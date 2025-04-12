import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { addMetadata, sendControlAs } from '../../../helpers/form.utils';
import { TranslationService } from '../../../services/translation.service';
import { Dropdown } from '../../components/action/dropdown.component';
import { IconButtonComponent } from '../../components/action/iconButton.component';
import { TextFieldComponent } from '../../components/action/textfield.component';
import { SlimDirective } from '../../directives/slim.directive';
import { awnserTypeOptions } from './section.data';

@Component({
  selector: 'sections-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IconButtonComponent,
    Dropdown,
    SlimDirective,
    TextFieldComponent,
  ],
  templateUrl: 'section.page.html',
  styleUrl: 'section.page.scss',
})
export class Sections {
  ButtonStyleEnum = ButtonStyleEnum;
  awnserTypeOptions = awnserTypeOptions;
  sendControlAs = sendControlAs;
  IconEnum = IconEnum;
  questionService = inject(TranslationService);
  dialog = inject(Dialog);
  currentQuestion: FormGroup;

  constructor(private fb: FormBuilder) {
    this.currentQuestion = this.fb.group({
      question: '',
      answerType: '',
      answers: new FormArray<AbstractControl<string>>([]),
      validators: [],
      allows: [],
    });
    addMetadata(this.currentQuestion, {
      question: {
        type: 'text',
      },
      answerType: {
        label: 'Type',
      },
    });
  }

  questionValue = model('');

  answerTypeSelected = computed(() => {
    return !!this.currentQuestion.controls['answerType']?.value;
  });
  answers = new FormGroup({});

  newSection() {}

  addAnswer() {}
}
