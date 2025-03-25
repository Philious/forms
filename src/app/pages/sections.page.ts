import { Component, inject, model } from "@angular/core";
import { ToolBarComponent } from "../components/toolbar.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Dialog } from "@angular/cdk/dialog";
import { QuestionService } from "../components/questions/question.service";

@Component({
  selector: 'sections-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToolBarComponent],
  template: `
  <tool-bar (add)="newSection()" [(filter)]="searchFilter"/>
  `,
  styles: ``
})
export class Sections {
  questionService = inject(QuestionService);
  dialog = inject(Dialog);

  searchFilter = model('');

  newSection() { }
}
