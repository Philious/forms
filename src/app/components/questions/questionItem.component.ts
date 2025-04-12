import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonStyleEnum, IconEnum } from '../../../helpers/enum';
import { FormTranslationGroup } from '../../../helpers/translationTypes';
import { InputLayoutComponent } from '../action/input.layout.component';

@Component({
  selector: 'translation-set',
  template: `
    <ul [formGroup]="translationformGroup()" class="list">
      @for (form of translationformGroup().controls | keyvalue; track form.key)
      {
      <li class="list-item">
        <div class="translation-wrapper">
          <label class="translation-label">{{ form.key }}</label>
          <input-layout class="text-field">
            <input
              class="translation-input"
              type="text"
              [formControlName]="form.key"
              base-input
              input
            />
          </input-layout>
        </div>
      </li>
      }
    </ul>
  `,
  styles: `
    .list {
      display: grid;
      gap: 1rem;
      margin: .5rem 0 1rem;
    }
    .list-item {
      margin-left: 2rem;
    }
    .translation-label {
      width: 2.25rem;
      display: grid;
      place-items: center;
    }
    .text-field {
      flex: 1;
    }
    .translation-wrapper {
      display: flex;
      
    }
    .translation-input {
      flex: 1;
    }
  `,

  imports: [
    InputLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class TranslationSetComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  IconEnum = IconEnum;
  translationformGroup = input.required<FormTranslationGroup>();
}
