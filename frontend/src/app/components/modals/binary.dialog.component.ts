import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActionButton } from '@src/helpers/types';
import { DialogLayoutComponent } from './dialogLayout.component';
import { openDialog } from './modal.utils';

@Component({
  imports: [DialogLayoutComponent, CommonModule],
  template: ` <dialog-layout class="dialog" [title]="title()" [content]="content()" [footerButtons]="buttons"> </dialog-layout> `,
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
  private dialogRef = inject(DialogRef);
  protected title = computed<string>(() => this.dialogRef.config.data?.title);
  protected content = computed<string>(() => this.dialogRef.config.data?.content);

  protected error = signal<boolean>(false);

  protected action() {
    if (this.error()) return;
    this.dialogRef?.config?.data.action.resolve();
    this.dialogRef?.close();
  }

  protected close() {
    this.dialogRef?.config?.data?.action.reject?.();
    this.dialogRef?.close();
  }

  protected buttons: ActionButton[] = [
    { id: 'cancel', label: 'Cancel', action: this.close },
    { id: 'ok', label: 'Ok', action: this.action },
  ];
}

export async function openBinaryDialog(title: string, content: string) {
  return await openDialog<BinaryDialogComponent>(BinaryDialogComponent, {
    title,
    content,
  });
}
