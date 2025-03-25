import { Component, input } from "@angular/core";
import { InputLayoutComponent } from "../action/input.layout.component";
import { ButtonStyleEnum, IconEnum } from "../../../helpers/enum";
import { FormTranslations } from "../../../helpers/types";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'question-item',
  template: `
    <ul [formGroup]="formGroup()" class="list">
      @for (form of formGroup().controls | keyvalue; track form.key) {
        <li class="list-item">
          <div class="translation-wrapper">
            <label class="translation-label">{{form.key}}</label>
            <input-layout class="text-field">
              <input type="text" [formControlName]="form.key" base-input input/>
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
  `,

  imports: [InputLayoutComponent, FormsModule, ReactiveFormsModule, CommonModule]
})
export class QuestionsItemComponent {
  ButtonStyleEnum = ButtonStyleEnum
  IconEnum = IconEnum;
  formGroup = input.required<FormTranslations>()


}