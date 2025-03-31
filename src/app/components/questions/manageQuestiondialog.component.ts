import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { TextButton } from "../action/textButton.component";
import { InputLayoutComponent } from "../action/input.layout.component";
import { DialogComponent } from "../modals/dialogLayout.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslationSet } from './types';
import { createEmptyTranslations, translationsToFormGroup } from '../../../helpers/translation.utils';


@Component({
  selector: 'manage-question-dialog',
  host: {
    attr: 'cdkTrapFocus'
  },
  template: `
    <dialog-layout>
      <div class="header" slot="header">
        {{ false ? 'Update tranlation' : 'New translation'}}
      </div>
      <div class="content" slot="content">
        <input-layout [label]="'Translation id'">
          <input type="text" [(ngModel)]="inputModel" list="languages"/>
          <datalist id="languages">
            @for (path of filteredData(); track path) {
            <option [value]="path" ></option>
            }
          </datalist>
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
  data = inject<string[]>(DIALOG_DATA);

  id = input<string | null>(null);
  translations = input<TranslationSet>(createEmptyTranslations());
  needs = input<string[]>([]);
  requires = input<string[]>([]);

  inputModel = model<string | null>(null);

  filteredData = computed(() => {
    const filter = this.inputModel() ?? ''
    const letterCount = filter.length;

    return letterCount > 0 ? this.data.filter(t => t.slice(0, letterCount) === filter) : this.data
  })

  translationArray = Object.keys(this.translations());
  translationFormGroup = translationsToFormGroup(this.translations());

  constructor() {
    console.log(this.data);
  }


  add() { }
  cancel = output.bind(close);

}