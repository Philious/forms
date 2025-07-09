import { moveItemInArray } from '@angular/cdk/drag-drop';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AnswerTypeEnum, Question, QuestionId, Section, SectionId } from '@cs-forms/shared';
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

  private readonly _currentSectionId = signal<SectionId | null>(null);
  private readonly _currentSection = signal<Section | null>(null);

  protected readonly _canSave = signal<boolean>(false);
  protected readonly _currentQuestionId = signal<QuestionId | null>(null);
  protected readonly _currentQuestion = signal<Question | null>(null);

  sections = this._sectionResource.sections;
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
      this._currentSection.set(section ? this.spreadSection(section) : null);
    });
    effect(() => {
      const question = this.questions().get(this._currentQuestionId() ?? '');
      this._currentQuestion.set(question ? this.spreadQuestion(question) : null);
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

  setCurrentSectionId = (id: SectionId | null) => this._currentSectionId.set(id);
  setCurrentQuestionId = (id: QuestionId | null) => this._currentQuestionId.set(id);

  /** Sections */
  spreadSection = (section: Section) => {
    const questions = section?.questions ?? [];
    return section ? { ...section, questions: [...questions] } : null;
  };

  addSection = (name: string): void => {
    const section: Section = {
      id: `section-${uid()}`,
      name,
      description: '',
      updated: new Date().valueOf(),
      questions: [],
    };

    this._sectionResource.add(section, () => this.setCurrentSectionId(section.id));
  };

  saveSection = () => {
    const section = this._currentSection();
    console.log('Save Current Section', section);
    if (section) this._sectionResource.update(section);
  };

  updateCurrentSection<K extends keyof Section>(key: K, update: Section[K], updateStrategy: 'replace' | 'add' = 'add'): void {
    console.log('updateCurrentSection', key, update);
    this._currentSection.update(section => {
      const sectionUpdate = updateStrategy === 'add' ? updateKeyInObject(section, key, update) : replaceKeyInObject(section, key, update);
      if (sectionUpdate) return { ...sectionUpdate, questions: [...sectionUpdate.questions] };
      return section;
    });
  }

  updateQuestionListOrder(prevIndex: number, currIndex: number): void {
    console.log('updateQuestionListOrder');
    const section = this._currentSection();
    if (section) {
      moveItemInArray([...section.questions], prevIndex, currIndex);
      this.updateCurrentSection('questions', section.questions);
    }
  }

  updateSection() {
    console.log('save Current Section');
    const section = this._currentSection();
    if (section) this._sectionResource.update(section);
    else console.log('no section');
  }

  /** Questions */
  spreadQuestion = (question: Question) => {
    const answers = question?.answers ?? [];
    const validators = question?.validators ?? [];
    const conditions = question?.conditions ?? [];

    return question ? { ...question, answers: [...answers], validators: [...validators], conditions } : question;
  };

  addQuestion = (entry: string) => {
    console.log('add question');
    const newQuestion: Question = {
      id: `question-${uid()}`,
      entry,
      updated: new Date().valueOf(),
      answerType: AnswerTypeEnum.RadioButton,
      answers: [],
      validators: [],
      conditions: {},
    };

    this._questionResource.add(newQuestion, () => {
      this.updateCurrentSection('questions', [newQuestion.id]);
      this.setCurrentQuestionId(newQuestion.id);
      this.saveSection();
    });
  };

  updateCurrentQuestion<K extends keyof Question>(key: K, update: Question[K], updateStrategy: 'replace' | 'add' = 'add'): void {
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

  saveQuestion() {
    console.log('Save Current Question');
    const question = this._currentQuestion();
    if (question) {
      const payload = currentQuestionPayload(question, this._answerResource.answers());
      this._questionResource.update(payload);
    }
  }
}
