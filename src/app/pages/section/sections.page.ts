import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { addMetadata, fetchFormArrayAs, fetchFormControlAs, fetchFormGroupAs } from '../../../helpers/form.utils';
import { QuestionProps, TextFieldMetaData } from '../../../helpers/types';
import { TranslationService } from '../../../services/translation.service';
import { DropdownComponent } from '../../components/action/dropdown.component';
import { IconButtonComponent } from '../../components/action/iconButton.component';
import { TextFieldComponent } from '../../components/action/textfield.component';
import { SlimDirective } from '../../directives/slim.directive';
import { AnswerTypeEnum, awnserTypeOptions } from './section.data';

@Component({
  selector: 'sections-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconButtonComponent, DropdownComponent, SlimDirective, TextFieldComponent],
  templateUrl: 'section.page.html',
  styleUrl: 'section.page.scss',
})
export class SectionComponent implements OnInit {
  ButtonStyleEnum = ButtonStyleEnum;
  AnswerTypeEnum = AnswerTypeEnum;
  awnserTypeOptions = awnserTypeOptions;
  fetchFormGroupAs = fetchFormGroupAs;
  fetchFormArrayAs = fetchFormArrayAs;
  fetchFormControlAs = fetchFormControlAs;
  IconEnum = IconEnum;
  questionService = inject(TranslationService);
  dialog = inject(Dialog);
  currentQuestion: FormGroup;

  constructor(private fb: FormBuilder) {
    const currentQuestion: FormGroup = this.fb.group({
      question: new FormControl(''),
      answerType: new FormControl(null),
      answers: new FormArray([new FormControl('')]),
      validators: new FormControl([]),
      allows: new FormControl([]),
    } as QuestionProps);
    this.currentQuestion = addMetadata<TextFieldMetaData>(currentQuestion, {
      question: {
        type: 'text',
      },
      answerType: {
        label: 'Type',
      },
    });
  }

  questionValue = model('');

  answerTypeSelected = signal<AnswerTypeEnum | null>(null);
  answers = new FormGroup({});

  ngOnInit(): void {
    this.currentQuestion.controls['answerType'].valueChanges.subscribe(v => this.answerTypeSelected.set(v));
  }

  newSection() {}

  addAnswer() {
    (this.currentQuestion.get('answers') as FormArray)?.push(new FormControl(''));
  }
}
