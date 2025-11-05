import { moveItemInArray } from '@angular/cdk/drag-drop';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EntryTypeEnum, Question, QuestionId, Section, SectionId } from '@cs-forms/shared';
import { AnswerResource } from 'src/resources/answerResource';
import { QuestionResource } from 'src/resources/questionResource';
import { SectionResource } from 'src/resources/sectionResource';
import { v4 as uid } from 'uuid';
import { currentQuestionPayload, replaceKeyInObject, updateKeyInObject } from './utils';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private readonly _sectionResource = inject(SectionResource);
  private readonly _questionResource = inject(QuestionResource);
  private readonly _answerResource = inject(AnswerResource);

  private readonly _currentSectionId = signal<SectionId | null>('section-ea5e49d5-d292-4d49-a137-9326a0a60620');
  private readonly _currentSection = signal<Section | null>(null);

  protected readonly _canSave = signal<boolean>(false);
  protected readonly _currentQuestionId = signal<QuestionId | null>('question-96e61d4d-3f48-4005-9336-cb7cbab77de1');
  protected readonly _currentQuestion = signal<Question | null>(null);

  readonly sections = this._sectionResource.sections;
  questions = this._questionResource.questions;

  canSave = this._canSave.asReadonly();

  currentSection = this._currentSection.asReadonly();
  currentQuestion = this._currentQuestion.asReadonly();
  currentSectionQuestions = computed<Question[]>(() =>
    (this._currentSection()?.questions ?? []).reduce((acc, id) => {
      const question = this.questions().get(id);
      if (question) acc.push(question);
      return acc;
    }, [] as Question[])
  );

  constructor() {
    effect(() => {
      const section = this.sections().get(this._currentSectionId() ?? '');
      this._currentSection.set(section ? this._spreadSection(section) : null);
    });
    effect(() => {
      const question = this.questions().get(this._currentQuestionId() ?? '');
      this._currentQuestion.set(question ? this._spreadQuestion(question) : null);
    });
    effect(() => {
      const section = this.currentSection();
      const question = this._currentQuestion();
      if (section || question) {
        console.log(
          // JSON.stringify(section) !== JSON.stringify(this.sections().get(section?.id ?? '')),
          // JSON.stringify(question) !== JSON.stringify(this.questions().get(question?.id ?? '')),
          question?.entry,
          this.questions().get(question?.id ?? '')?.entry
        );
      }
      this._canSave.set(
        (!!section && JSON.stringify(section) !== JSON.stringify(this.sections().get(section.id))) ||
          (!!question && JSON.stringify(question) !== JSON.stringify(this.questions().get(question.id)))
      );
    });
  }

  private _setCurrentSectionId = (id: SectionId | null) => this._currentSectionId.set(id);
  private _setCurrentQuestionId = (id: QuestionId | null) => this._currentQuestionId.set(id);

  /** Sections */
  private _spreadSection = (section: Section) => {
    const questions = section?.questions ?? [];
    return section ? { ...section, questions: [...questions] } : null;
  };

  private _addSection = (name: string): void => {
    const section: Section = {
      id: `section-${uid()}`,
      name,
      description: '',
      updated: new Date().valueOf(),
      questions: [],
    };

    this._sectionResource.add(section, () => this._setCurrentSectionId(section.id));
  };

  private _saveSection = () => {
    const section = this._currentSection();
    console.log('Save Current Section', section);
    if (section) this._sectionResource.update(section);
    else console.log('no section');
  };

  private _updateCurrentSection<K extends keyof Section>(key: K, update: Section[K], updateStrategy: 'replace' | 'add' = 'add'): void {
    console.log('updateCurrentSection', key, update);
    this._currentSection.update(section => {
      const sectionUpdate = updateStrategy === 'add' ? updateKeyInObject(section, key, update) : replaceKeyInObject(section, key, update);
      if (sectionUpdate) return { ...sectionUpdate, questions: [...sectionUpdate.questions] };
      return section;
    });
  }

  private updateQuestionListOrder(prevIndex: number, currIndex: number): void {
    console.log('updateQuestionListOrder');
    const section = this._currentSection();
    if (section) {
      moveItemInArray([...section.questions], prevIndex, currIndex);
      this._updateCurrentSection('questions', section.questions);
    }
  }

  section = {
    add: this._addSection,
    update: this._updateCurrentSection,
    save: this._saveSection,
    set: this._setCurrentSectionId,
  };

  /** Questions */
  private _spreadQuestion = (question: Question) => {
    const answers = question?.answers ?? [];
    const validators = question?.validators ?? [];
    const conditions = question?.conditions ?? [];

    return question ? { ...question, answers: [...answers], validators: [...validators], conditions } : question;
  };

  private _addQuestion = (entry: string) => {
    console.log('add question');
    const newQuestion: Question = {
      id: `question-${uid()}`,
      entry,
      updated: new Date().valueOf(),
      answerType: EntryTypeEnum.RadioGroup,
      answers: [],
      validators: [],
      conditions: {},
    };

    this._questionResource.add(newQuestion, () => {
      this._updateCurrentSection('questions', [newQuestion.id]);
      this._setCurrentQuestionId(newQuestion.id);
      this._saveSection();
    });
  };

  private _updateCurrentQuestion<K extends keyof Question>(key: K, update: Question[K], updateStrategy: 'replace' | 'add' = 'add'): void {
    console.log('update current question');
    this._currentQuestion.update(question => {
      const questionUpdate = updateStrategy === 'add' ? updateKeyInObject(question, key, update) : replaceKeyInObject(question, key, update);
      if (questionUpdate)
        return {
          ...question,
          ...questionUpdate,
          answers: [...(question?.answers ?? []), ...questionUpdate.answers],
          validators: [...(question?.validators ?? []), ...questionUpdate.validators],
        } as Question;
      return questionUpdate;
    });
  }

  private _saveQuestion() {
    console.log('Save Current Question');
    const question = this._currentQuestion();
    if (question) {
      const payload = currentQuestionPayload(question, this._answerResource.answers());
      this._questionResource.update(payload);
    }
  }

  question = {
    add: this._addQuestion,
    update: this._updateCurrentQuestion,
    save: this._saveQuestion,
    set: this._setCurrentQuestionId,
    updateOrder: this.updateQuestionListOrder,
  };
}
