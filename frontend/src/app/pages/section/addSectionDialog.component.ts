import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLayoutComponent } from '../../components/action/input-layout/input.layout.component';
import { TextButtonComponent } from '../../components/action/textButton.component';
import { DialogLayoutComponent } from '../../components/modals/dialogLayout.component';

type AddSectionDialogData = {
  initialName: string;
  addSection: (name: string) => void;
};

@Component({
  selector: 'add-section-dialog',
  imports: [DialogLayoutComponent, CommonModule, TextButtonComponent, DialogLayoutComponent, FormsModule, ReactiveFormsModule, InputLayoutComponent],
  template: ` <dialog-layout>
    <ng-content dialog-title>Title</ng-content>
    <ng-content dialog-content>
      <input-layout [label]="'Name'" [control]="sectionNameControl">
        <input [formControl]="sectionNameControl" input />
      </input-layout>
    </ng-content>
    <ng-content dialog-footer>
      <text-button [label]="'Cancel'" (clicked)="close()" />
      <text-button [label]="'Add'" (clicked)="add()" />
    </ng-content>
  </dialog-layout>`,
  styles: `
    .content {
      background: red;
      color: white;
    }
  `,
})
export class AddSectionDialogComponent {
  dialogRef = inject<DialogRef<string>>(DialogRef);
  data = inject<AddSectionDialogData>(DIALOG_DATA);

  sectionNameControl = new FormControl(this.data.initialName, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
    updateOn: 'blur',
  });

  add() {
    this.sectionNameControl.markAsTouched();
    this.sectionNameControl.updateValueAndValidity();

    if (this.sectionNameControl.valid) {
      this.data.addSection(this.sectionNameControl.value);
      this.dialogRef.close();
    } else {
    }
  }
  close() {
    this.sectionNameControl.clearValidators();
    this.dialogRef.close();
  }
}
