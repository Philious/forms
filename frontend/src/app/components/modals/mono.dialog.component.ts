import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable } from '@angular/core';
import { ButtonStyleEnum } from '@src/helpers/enum';

import { ButtonComponent } from '../action/base-button.component';
import { DialogLayoutComponent } from './dialogLayout.component';

export type BinaryDialogType<T = unknown> = {
  title: string;
  content: string;
  action: {
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
  };
};

@Component({
  imports: [DialogLayoutComponent, ButtonComponent, CommonModule],
  template: `
    <dialog-layout class="dialog">
      <ng-content dialog-title>{{ title() }}</ng-content>
      <ng-content dialog-content>
        {{ content() }}
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
export class BinaryDialogComponent {
  ButtonStyleEnum = ButtonStyleEnum;
  dialogRef = inject(DialogRef);

  title = computed<string>(() => this.dialogRef.config.data?.title);
  content = computed<string>(() => this.dialogRef.config.data?.content);

  action() {
    this.dialogRef?.config?.data?.action.resolve();
    this.dialogRef?.close();
  }

  close() {
    this.dialogRef?.config?.data?.action.reject();
    this.dialogRef?.close();
  }
}

@Injectable({ providedIn: 'root' })
export class BinaryDialog {
  protected readonly dialog = inject(Dialog);

  async open<T>(
    title: string,
    content: string,
    action: {
      resolve: (value?: unknown) => void;
      reject: (reason?: unknown) => void;
    }
  ) {
    this.dialog.open<BinaryDialogComponent, BinaryDialogType<T>>(BinaryDialogComponent, {
      disableClose: true,
      data: { title, content, action },
    });
  }
}

export async function openFn(fn: (resolve: (value?: unknown) => void, reject: () => void) => void): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    return fn(resolve, reject);
  });
}
