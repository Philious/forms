import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { ButtonStyleEnum } from '@src/helpers/enum';
import { spreadTranslation } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { TextButtonComponent } from '../action/base-button.component';
import { TranslationInputComponent } from '../action/translation-input';
import { DialogLayoutComponent } from './dialogLayout.component';

type AddNewDialogType = {
  title: string;
  content: string;
  callback: (name: string) => boolean;
};

@Injectable({ providedIn: 'root' })
@Component({
  imports: [DialogLayoutComponent, TranslationInputComponent, TextButtonComponent, CommonModule],
  template: `
    <dialog-layout class="dialog">
      <ng-content dialog-title>{{ title() }}</ng-content>
      <ng-content dialog-content>
        {{ content() }}
        <translation-input [(translations)]="value" />
      </ng-content>
      <ng-content dialog-footer>
        <button base-button class="cancel-btn btn" [buttonStyle]="ButtonStyleEnum.Filled" (click)="close(true)">Cancel</button>
        <button base-button class="btn" [buttonStyle]="ButtonStyleEnum.Filled" (click)="close()">OK</button>
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
  protected readonly dialog = inject(Dialog);
  protected dialogRef: DialogRef<AddNewDialogType, AddNewDialogComponent> | null = null;
  protected title = computed<string>(() => this.dialog.openDialogs[0].config.data.title ?? '');
  protected content = computed<string>(() => this.dialog.openDialogs[0].config.data.content ?? '');
  protected callback = computed<(name: Translation) => boolean>(() => this.dialog.openDialogs[0].config.data.callback);
  protected value = signal<Translation>(spreadTranslation(''));
  protected error = signal<boolean>(false);

  open(title: string, content: string, callback: (name: Translation) => boolean) {
    this.dialog.open(AddNewDialogComponent, {
      data: { title, content, callback },
    });
  }
  update() {
    if (this.error()) this.error.set(this.callback()(this.value()));
  }
  close(cancel?: boolean) {
    if (cancel) {
      this.dialog.closeAll();
      return;
    }
    const result = this.callback()(this.value());
    if (result) {
      this.value.set(spreadTranslation(''));
      this.error.set(false);
      this.dialog.closeAll();
    } else this.error.set(true);
  }
}
