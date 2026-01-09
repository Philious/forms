import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef } from '@angular/core';
import { BinaryDialogComponent } from './binary.dialog.component';

export function binaryOptionsFn<R>(fn: (resolve: (value: R) => void, reject: (reason: unknown) => void) => void): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    fn(resolve, reject);
  });
}

export type DialogActions<R = unknown> = {
  resolve: (value: unknown) => R;
  reject: (reason: unknown) => void;
};

export type BinaryDialogType = {
  title: string;
  content: string;
};

export async function openDialog<C, T extends BinaryDialogType = BinaryDialogType, R = unknown>(
  dialog: Dialog,
  props: T,
  component?: ComponentType<C> | TemplateRef<C>
): Promise<R> {
  return await binaryOptionsFn<R>((resolve, reject) => {
    dialog.open<ComponentType<C> | TemplateRef<C>, T & Record<'action', DialogActions<R>>>(component || BinaryDialogComponent, {
      disableClose: true,
      data: {
        ...props,
        action: {
          resolve,
          reject,
        } as DialogActions<R>,
      },
    });
  });
}
