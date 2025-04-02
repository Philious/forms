import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { TextButton } from "../action/textButton.component";
import { InputLayoutComponent } from "../action/input.layout.component";
import { DialogComponent } from "../modals/dialogLayout.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslationSet } from './types';
import { createEmptyTranslations, translationsToFormGroup } from '../../../helpers/translation.utils';
import { Language } from '../../../helpers/enum';
import { FormTranslation, LanguageSet } from '../../../helpers/translationTypes';
import { TranslationService } from '../../../services/translation.service';


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
          <input type="text" [(ngModel)]="modelValue" list="languages"/>
          <datalist id="languages">
            @for (path of dataList(); track path) {
            <option [value]="path" ></option>
            }
          </datalist>
        </input-layout>
        <div class="content" [formGroup]="langFormGroup">
        @for (trans of langFormGroup.controls | keyvalue; track trans) {
          <input-layout [label]="trans.key">
            <input type="text" [formControlName]="trans.key"/>
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
export class AddTranslationKeyDialogComponent {
  translationService = inject(TranslationService)
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject<{ link: string }>(DIALOG_DATA);

  modelValue = model<string>(this.data.link);

  langFormGroup: FormGroup<FormTranslation>;

  constructor() {
    const langSet = Object.values(Language).reduce((acc, lang) => {
      return { ...acc, [lang]: new FormControl('') }
    }, {} as FormTranslation)
    this.langFormGroup = new FormGroup(langSet);
  }

  dataList = computed<string[]>(() => {
    const filter = this.modelValue().valueOf() ?? ''
    const letterCount = filter.length;

    return letterCount > 0 ? [...this.translationService.allTranslations().keys()].filter(t => t.slice(0, letterCount) === filter) : [this.data.link]
  })




  add() { }
  cancel = output.bind(close);

}