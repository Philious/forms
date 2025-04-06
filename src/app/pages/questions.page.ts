import { Component, inject, model, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum'
import { Dialog } from "@angular/cdk/dialog";
import { TranslationService } from "../../services/translation.service";
import { FolderComponent } from "../components/folder.component";
import { ToolBarComponent } from "../components/toolbar.component";
import { FormTranslation } from "../../helpers/translationTypes";

@Component({
  selector: 'questions',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FolderComponent, ToolBarComponent],
  template: `
    <tool-bar [(filter)]="searchFilter"/>
    @let translations = translationTree();
    @if (!loading() && translations) { 
        <folder [data]="translations" [title]="'root'" (state)="updateChildState($event)"/>
    } @else { Loading ... }
  `,
  styles: `
    ul {
      display: flex;
      flex-direction: column;
      gap: .25rem;
      padding-bottom: 4rem;
    }
    li {
      display: inline-flex;
      gap: .25rem;
      align-items: flex-end;
      justify-content: stretch;
      
    }
    .list-item-add { margin: .5rem 2rem 1.5rem;}
    .folded {
      display: flex;
      .fold-icon {
        transform: rotate(-90deg);
      }
      .question-title { 
        display: flex;
        align-items: center;
      }
    }
    .title-wrapper,
    .translation-wrapper {
      display: flex;
      align-items: center;
    }
    .translation-wrapper {
      margin-left: 2.25rem;
    }
    .translation-label {
      margin-right: .5rem;
    }
    .text-field { flex: 1; }
    .open {
      display: grid;
      width: 100%;
      place-items: center stretch;
      gap: .5rem;
      
    }
  `
})
export class Questions {
  translationService = inject(TranslationService);
  dialog = inject(Dialog);

  ButtonStyleEnum = ButtonStyleEnum;
  IconEnum = IconEnum;
  loading = this.translationService.loading
  translationTree = this.translationService.translationTree;
  searchFilter = model('');
  childState = signal<number>(0);
  newQuestionData: FormTranslation | null = null;

  updateChildState(isOpen: boolean) {
    this.childState.update(update => {
      isOpen ? update++ : update--;
      return update;
    })
  }
}
