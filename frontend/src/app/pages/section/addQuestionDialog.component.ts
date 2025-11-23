import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLayoutComponent } from '../../components/action/input-layout/input.layout.component';
import { TextButtonComponent } from '../../components/action/textButton.component';
import { DialogLayoutComponent } from '../../components/modals/dialogLayout.component';

type AddQuestionDialogData = {
  initialName: string;
  addQuestion: (name: string) => void;
};

@Component({
  selector: 'add-question-dialog',
  imports: [DialogLayoutComponent, CommonModule, TextButtonComponent, DialogLayoutComponent, FormsModule, ReactiveFormsModule, InputLayoutComponent],
  template: ` <dialog-layout>
    <ng-content dialog-title>Title</ng-content>
    <ng-content dialog-content>
      <input-layout [label]="'Name'">
        <input [formControl]="questionNameControl" input />
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
export class AddQuestionDialogComponent {
  dialogRef = inject<DialogRef<string>>(DialogRef);
  data = inject<AddQuestionDialogData>(DIALOG_DATA);

  questionNameControl = new FormControl(this.data.initialName, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
    updateOn: 'blur',
  });

  add() {
    this.questionNameControl.markAsTouched();
    this.questionNameControl.updateValueAndValidity();
    if (this.questionNameControl.valid) {
      this.data.addQuestion(this.questionNameControl.value);
      this.dialogRef.close();
    }
  }
  close() {
    this.questionNameControl.clearValidators();
    this.dialogRef.close();
  }
}
