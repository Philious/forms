import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { ButtonStyleEnum } from '@src/helpers/enum';
import { spreadTranslation } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { ButtonComponent } from '../action/base-button.component';
import { TranslationInputComponent } from '../action/translation-input';
import { DialogLayoutComponent } from './dialogLayout.component';
import { openDialog } from './modal.utils';

@Component({
  imports: [DialogLayoutComponent, TranslationInputComponent, ButtonComponent, CommonModule],
  template: `
    <dialog-layout class="dialog">
      <ng-content dialog-title>{{ title() }}</ng-content>
      <ng-content dialog-content>
        <translation-input [(translations)]="value" (hasError)="this.error.set($event)" />
      </ng-content>
      <ng-content dialog-footer>
        <button base-button class="cancel-btn btn" [buttonStyle]="ButtonStyleEnum.Filled" (click)="close()">Cancel</button>
        <button base-button class="btn" [buttonStyle]="ButtonStyleEnum.Filled" (click)="action()">OK</button>
      </ng-content>
    </dialog-layout>
  `,
  styles: `
    .dialog {
      min-width: 24rem;
    }
    .btn {
      text-transform: uppercase;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .cancel-btn {
      margin-left: auto;
    }
  `,
})
export class AddNewDialogComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  dialogRef = inject(DialogRef);
  title = computed<string>(() => this.dialogRef.config.data?.title);
  content = computed<string>(() => this.dialogRef.config.data?.content);
  value = signal<Translation>(spreadTranslation({}, this.dialogRef.config.data?.initialValue));
  error = signal<boolean>(false);

  action() {
    if (this.error()) return;
    this.dialogRef?.config?.data.action.resolve(this.value());
    this.dialogRef?.close();
  }

  close() {
    this.dialogRef?.close();
    this.dialogRef?.config?.data?.action.reject?.();
  }
  constructor() {
    console.log(this.dialogRef?.config?.data);
  }
}

type AddDialogProps = { title: string; content: string; initialValue?: string };
@Injectable({ providedIn: 'root' })
export class AddDialog {
  dialog = inject(Dialog);

  async open(props: AddDialogProps): Promise<Translation> {
    return await openDialog<AddNewDialogComponent, AddDialogProps, Translation>(this.dialog, props, AddNewDialogComponent);
  }
}
