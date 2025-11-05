import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../helpers/enum';
import { FormTranslation, LanguageSet } from '../../../helpers/translationTypes';
import { TranslationService } from '../../../services/translation.service';
import { InputLayoutComponent } from '../../components/action/input.layout.component';
import { TextButtonComponent } from '../../components/action/textButton.component';
import { DialogLayoutComponent } from '../../components/modals/dialogLayout.component';

@Component({
  selector: 'manage-question-dialog',
  host: {
    attr: 'cdkTrapFocus',
  },
  template: `
    <dialog-layout>
      <div class="header" slot="header">
        {{ false ? 'Update tranlation' : 'New translation' }}
      </div>
      <div class="content" slot="content">
        <input-layout [label]="'Translation id'">
          <input type="text" [(ngModel)]="modelValue" list="languages" />
          <datalist id="languages">
            @for (path of dataList(); track path) {
              <option [value]="path"></option>
            }
          </datalist>
        </input-layout>
        <div class="content" [formGroup]="langFormGroup">
          @for (trans of langFormGroup.controls | keyvalue; track trans) {
            <input-layout [label]="trans.key">
              <input type="text" [formControlName]="trans.key" />
            </input-layout>
          }
        </div>
      </div>
      <div class="footer" slot="footer">
        <text-button [label]="'Cancel'" (click)="dialogRef.close()" />
        <text-button [label]="'Add'" (click)="add()" />
      </div>
    </dialog-layout>
  `,
  imports: [TextButtonComponent, InputLayoutComponent, DialogLayoutComponent, CommonModule, FormsModule, ReactiveFormsModule],
  styles: `
    :host {
      padding: 1.5rem;
    }
    .content {
      display: grid;
      gap: 1rem;
    }
    .footer {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
})
export class AddTranslationKeyDialogLayoutComponent {
  translationService = inject(TranslationService);
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject<{ link: string }>(DIALOG_DATA);

  modelValue = model<string>(this.data.link);

  langFormGroup: FormGroup<FormTranslation>;

  constructor() {
    const langSet = Object.values(Language).reduce((acc, lang) => {
      return { ...acc, [lang]: new FormControl('') };
    }, {} as FormTranslation);
    this.langFormGroup = new FormGroup(langSet);
  }

  dataList = computed<string[]>(() => {
    const filter = this.modelValue().valueOf() ?? '';
    const letterCount = filter.length;
    const stranslationsObject = this.translationService.allTranslations();
    return letterCount > 0 ? Object.keys(stranslationsObject).filter(t => t.slice(0, letterCount) === filter) : [this.data.link];
  });

  add() {
    const formgroupValue = this.langFormGroup.value as LanguageSet;
    this.translationService.addEntry(this.modelValue(), formgroupValue);
    this.dialogRef.close();
  }
  cancel = output.bind(close);
}
