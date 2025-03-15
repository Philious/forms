import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { InputLayoutComponent } from "../action/input.layout.component";
import { Question } from "../../../helpers/types";
import questions from '../../../assets/questions.json';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { toTranslationsFormGroup, TranslationCollection } from "./questions.utils";
import { IconButtonComponent } from "../action/iconButton.component";
import { ButtonStyleEnum, IconEnum, Language } from '../../../helpers/enum'
import { TextButton } from "../action/textButton.component";
import { TranslationService } from "../../../services/translation.service";
import { ManageQuestionDialogComponent } from "../modals/manageQuestiondialog.component";
import { Dialog } from "@angular/cdk/dialog";

@Component({
  selector: 'questions',
  imports: [CommonModule, InputLayoutComponent, ReactiveFormsModule, FormsModule, IconButtonComponent, TextButton, ManageQuestionDialogComponent],
  template: `
    <div class="tool-bar">
      <text-button  [label]="'New'" (onClick)="newQuestion()"/>
      <input-layout class="search">
        <input type="search"  [(ngModel)]="search" placeholder="Search..." base-input input>
      </input-layout>
    </div>
    <ul [formGroup]="questionForm">
      @for (question of questions; track question.id) {
        <li [formGroup]="questionForm.controls[question.id]">
        @if (openTranslations().includes(question.id)) {
          <div class="open">
            <div class="title-wrapper">
              <icon-button class="fold-icon" [icon]="IconEnum.Down" (onClick)="toggleTranslations(question.id)" />
              <div class="question-title">{{question.translations[language()]}}</div>
            </div>
            @for (lang of langArray; track lang) {
              <div class="translation-wrapper">
                <label class="translation-label">{{lang}}</label>
                <input-layout class="text-field">
                  <input type="text" [formControlName]="lang" base-input input/>
                </input-layout>
                <icon-button class="remove-icon" [buttonStyle]="ButtonStyleEnum.Transparent" [icon]="IconEnum.Remove" />
              </div>
            }
          </div>
          } @else {
            <div class="folded">
              <icon-button class="fold-icon" [icon]="IconEnum.Down" (onClick)="toggleTranslations(question.id)" />
              @if (translationService.showTranslations()) {
                <div class="question-title">{{question.translations[language()]}}</div>
              } @else {
                <div class="question-title">{{question.id}}</div>
              }
          </div>
          }
        </li>
        }
    </ul>
    <manage-question-dialog (add)="newQuestion()" (cancel)="dialog.closeAll()"/>
  `,
  styles: ` 
    .tool-bar {
      display: flex;
      position: sticky;
      top: 4.5rem;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      justify-content: space-between;
      background-color: var(--n-100);
      z-index: 1;
      .search { --input-width: 200px; }
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 4rem;
    }
    li {
      display: inline-flex;
      gap: .25rem;
      align-items: flex-end;
      justify-content: stretch;
    }
    .folded {
      display: flex;
      .fold-icon {
        transform: rotate(-90deg);
      }
      .question-title { 
        display: flex;
        align-items: center;
      }
    }
    .title-wrapper,
    .translation-wrapper {
      display: flex;
      align-items: center;
    }
    .translation-wrapper {
      margin-left: 2.25rem;
    }
    .translation-label {
      margin-right: .5rem;
    }
    .text-field { flex: 1; }
    .open {
      display: grid;
      width: 100%;
      place-items: center stretch;
      gap: .5rem;
      
    }
  `
})
export class Questions implements OnInit {
  translationService = inject(TranslationService);
  dialog = inject(Dialog);

  questions = questions;
  openTranslations = signal<string[]>([])
  language = signal<Language>(Language.Swedish);
  langArray = Object.values(Language);
  ButtonStyleEnum = ButtonStyleEnum;
  IconEnum = IconEnum;
  questionForm!: TranslationCollection;

  search = '';

  newQuestion() {
    this.dialog.open(ManageQuestionDialogComponent);
  }
  toggleTranslations(idToggle: string) {
    const index = this.openTranslations().indexOf(idToggle);
    if (index !== -1) this.openTranslations.update(value => {
      value.splice(index, 1);
      console.log(value)
      return value;
    });
    else this.openTranslations.update(value => {
      value.push(idToggle)
      return value;
    });
    console.log('translations: ', this.openTranslations());
  };

  get searchFilter() {
    return ''
  }

  constructor() {
    // console.log(this.questions);
  }
  ngOnInit() {
    this.questionForm = toTranslationsFormGroup(this.questions as Question[]);
    // console.log(this.questionForm);
  }
}
