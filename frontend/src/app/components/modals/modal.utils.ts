import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { inject, TemplateRef } from '@angular/core';

export function binaryOptionsFn<R>(fn: (resolve: (value: R) => void, reject: (reason: unknown) => void) => void): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    fn(resolve, reject);
  });
}

type DialogActions<R = unknown> = {
  resolve: (value: unknown) => R;
  reject: (reason: unknown) => void;
};

type BinaryDialogType = {
  title: string;
  content: string;
};

export async function openDialog<C, T extends BinaryDialogType = BinaryDialogType, R = unknown>(
  component: ComponentType<C> | TemplateRef<C>,
  props: T
): Promise<R> {
  const dialog = inject(Dialog);

  return await binaryOptionsFn<R>((resolve, reject) => {
    dialog.open<ComponentType<C>, T & Record<'action', DialogActions<R>>>(component, {
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
