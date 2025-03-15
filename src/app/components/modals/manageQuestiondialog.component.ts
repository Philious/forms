import { Component, ElementRef, inject, model, output, TemplateRef } from '@angular/core';
import { Dialog, DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { TextButton } from "../action/textButton.component";
import { InputLayoutComponent } from "../action/input.layout.component";
import { DialogComponent } from "./dialogLayout.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'manage-question-dialog',
  host: {
    attr: 'cdkTrapFocus'
  },
  template: `
    <dialog-layout>
      <div class="header" slot="header">
        Test test
      </div>
      <div slot="content">
        <input-layout>
          <input/>
        </input-layout>
      </div>
      <div slot="footer">
        <text-button [label]="'Cancel'" (onClick)="this.cancel()"/>
        <text-button [label]="'Add'"/>
      </div>
    </dialog-layout>
  `,
  imports: [TextButton, InputLayoutComponent, DialogComponent, CommonModule],
  styles: `:host {
    width: 300px;
    height: 300px;
    background-color: orange;
  }`
})
export class ManageQuestionDialogComponent {
  add() { }
  cancel = output.bind(close)
}