import { Component, inject, input, model, output, signal } from '@angular/core';
import { TextButton } from "../action/textButton.component";
import { InputLayoutComponent } from "../action/input.layout.component";
import { DialogComponent } from "../modals/dialogLayout.component";
import { CommonModule } from '@angular/common';
import { Question, Translations } from '../../../helpers/types';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createEmptyTranslations, translationsToFormGroup } from './questions.utils';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'manage-question-dialog',
  host: {
    attr: 'cdkTrapFocus'
  },
  template: `
    <dialog-layout>
      <div class="header" slot="header">
        {{ translationId() ? 'Update tranlation' : 'New translation'}}
      </div>
      <div class="content" slot="content">
        <input-layout [label]="'Translation id'">
          <input type="text" [(ngModel)]="translationId"/>
        </input-layout>
        <div class="content" [formGroup]="translationFormGroup">
        @for (trans of translationArray; track trans) {
          <input-layout [label]="trans" [label]="trans">
            <input type="text" [formControlName]="trans"/>
          </input-layout>
        }
      </div>
      </div>
      <div class="footer" slot="footer">
        <text-button [label]="'Cancel'" (click)="dialogRef.close()" />
        <text-button [label]="'Add'" (click)="dialogRef.close()"/>
      </div>
    </dialog-layout>
  `,
  imports: [TextButton, InputLayoutComponent, DialogComponent, CommonModule, FormsModule, ReactiveFormsModule],
  styles: `:host {
   padding: 1.5rem;
  }
  .content { display: grid; gap: 1rem;}
  .footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
  }
  `
})
export class ManageQuestionDialogComponent {
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);

  id = input<string | null>(null);
  translationId = model<string | null>(null);
  translations = input<Translations>(createEmptyTranslations());
  needs = input<string[]>([]);
  requires = input<string[]>([]);

  translationArray = Object.keys(this.translations());
  translationFormGroup = translationsToFormGroup(this.translations());

  constructor() {
    console.log(this.translationFormGroup);
  }

  add() { }
  cancel = output.bind(close);

}