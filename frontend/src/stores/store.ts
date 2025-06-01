import { computed, effect, Injectable, signal } from '@angular/core';
import {
  addToMap,
  Answer,
  AnswerId,
  AnswerTypeEnum,
  ConditionFn,
  ConditionId,
  Question,
  QuestionId,
  QuestionPayload,
  Section,
  SectionId,
  SectionPayload,
  Validator,
  ValidatorFn,
  ValidatorId,
} from '@cs-forms/shared';
import { v4 as uid } from 'uuid';
import { Option } from '../helpers/types';

type UpdateFunction = (returnFunctionArray: Map<string, UpdateFunction>) => { id: string; fn: () => void };

@Injectable({
  providedIn: 'root',
})
export class Store {
  private readonly _sectionIds = signal<SectionId[]>([]);
  private readonly _currentSection = signal<Section | null>(null);
  private readonly _currentSectionId = signal<SectionId | null>(null);
  private readonly _questionIds = signal<QuestionId[]>([]);
  private readonly _currentQuestion = signal<QuestionPayload | null>(null);
  private readonly _currentQuestionId = signal<QuestionId | null>(null);
  private _loading = signal<boolean>(false);

  // Public read-only signals
  readonly loading = this._loading.asReadonly();

  readonly sectionIds = this._sectionIds.asReadonly();
  readonly currentSection = this._currentSection.asReadonly();
  readonly currentSectionId = this._currentSectionId.asReadonly();

  readonly questionIds = this._questionIds.asReadonly();
  readonly currentQuestion = this._currentQuestion.asReadonly();
  readonly currentQuestionId = this._currentQuestionId.asReadonly();

  readonly sectionNameAndIdList = computed(() => {
    const current = this.currentSection();
    return this._sectionIds().reduce((acc, id) => {
      const section = this.sectionMap.get(id);
      if (section && current?.id === section.id) acc = [...acc, { label: current.name, value: section.id }];
      if (section) acc = [...acc, { label: section?.name, value: section?.id }];
      return acc;
    }, [] as Option[]);
  });

  // Maps
  protected sectionMap = new Map<SectionId, Section>();
  protected questionMap = new Map<QuestionId, Question>();
  protected answerMap = new Map<AnswerId, string>();
  protected validatorMap = new Map<ValidatorId, ValidatorFn>();
  protected conditionMap = new Map<ConditionId, ConditionFn>();

  // Maps with functions run on effect update
  protected _onSectionUpdate: Map<string, UpdateFunction> = new Map();
  protected _onQuestionUpdate: Map<string, UpdateFunction> = new Map();

  constructor() {
    effect(() => {
      const section = this.sectionMap.get(this.currentSectionId() ?? '') ?? null;
      this._currentSection.set(section);
      this._onSectionUpdate.forEach(v => v(this._onSectionUpdate));
    });
    effect(() => {
      const questionId = this.currentQuestionId() ?? '';
      const question = this.questionMap.get(questionId) ?? null;
      console.log('EFFECT Section: ', questionId, question);
      if (question) this._currentQuestion.set(this.questionToPayload(question));
      this._onSectionUpdate.forEach(v => v(this._onQuestionUpdate));
    });
  }

  onSectionUpdate = (fn: UpdateFunction) => this._onSectionUpdate.set(fn(this._onSectionUpdate).id, fn);
  onQuestionUpdate = (fn: UpdateFunction) => this._onQuestionUpdate.set(fn(this._onQuestionUpdate).id, fn);
  removeSectionUpdateFn = (id: string) => this._onSectionUpdate.delete(id);
  removeQuestionUpdateFn = (id: string) => this._onQuestionUpdate.delete(id);

  protected startLoading() {
    this._loading.set(true);
  }
  protected endLoading() {
    this._loading.set(false);
  }

  /** Section Functions */
  section = {
    storeBatch: (section: Section[]) => section.forEach(s => this.sectionMap.set(s.id, s)),
    add: (section: Section) => {
      this.sectionMap.set(section.id, section);
      this._sectionIds.update(ids => [...ids, section.id]);
      this._currentSectionId.set(section.id);
    },
    setById: (id: SectionId | null) => this._currentSectionId.set(id),
    set: (section: Section | null) => {
      this._currentSection.set(section);
    },
    get: (id: SectionId) => this.sectionMap.get(id)!,
    getQuestionsBySectionId: (id: SectionId) => {
      const questionId = this.sectionMap.get(id)?.questions;
      return questionId?.map(id => this.questionMap.get(id)) ?? [];
    },
    update: <K extends keyof Section>(key: K, update: Section[K]): void => {
      this._currentSection.update(section => {
        if (!section) return section;
        if (key !== 'questions') section[key] = update;
        else section.questions = [...(section.questions as SectionId[]), update as SectionId];
        return section;
      });
    },
    remove: (id: SectionId) => {
      this.sectionMap.delete(id);
      this._sectionIds.update(() => [...this.sectionMap.keys()]);
    },
  };

  sectionToPayload(section: Section): SectionPayload {
    const { id, name, updated, description } = section;
    return {
      id,
      name,
      updated,
      description,
      questions: Object.fromEntries(
        section.questions.reduce(
          (acc, id) => {
            const question = this.questionMap.get(id as QuestionId);
            if (question) acc.push([id as QuestionId, this.questionToPayload(question)]);
            return acc;
          },
          [] as [string, QuestionPayload][]
        )
      ),
    };
  }

  payloadToSection(sectionsPayload: SectionPayload): Section {
    const { id, name, updated, description } = sectionsPayload;
    return {
      id,
      name,
      updated,
      description,
      questions: Object.values(sectionsPayload.questions).map(questionPayload => {
        return this.payloadToQuestion(questionPayload).id;
      }),
    };
  }

  /**  Question Functions */
  question = {
    storeBatch: () => {},
    get: (id: QuestionId) => this.questionMap.get(id)!,

    add: (entry: string) => {
      const newQuestion: QuestionPayload = {
        id: `question-${uid()}`,
        entry,
        updated: new Date().valueOf(),
        answerType: AnswerTypeEnum.RadioButton,
      };
      this._currentQuestion.set(newQuestion);
      this._currentQuestionId.set(newQuestion.id);
    },
    setById: (id: QuestionId) => {
      const question = this.questionMap.get(id)!;
      this._currentQuestion.set(this.questionToPayload(question));
    },
    update: (payload: QuestionPayload) => this.storeQuestionPayload(payload),
    remove: (id: QuestionId) => {
      const question = this.questionMap.get(id);
      question?.conditions?.forEach(c => this.conditionMap.delete(c));
      this.questionMap.delete(id);
    },
  };

  questionToPayload(question: Question): QuestionPayload {
    return {
      id: question.id,
      entry: question.entry,
      updated: question.updated,
      answerType: question.answerType,
      answers: question?.answers?.reduce((acc, id) => {
        const answer = this.answerMap.get(id);
        if (answer) acc = { ...acc, [id]: answer };
        return acc;
      }, {} as Answer),
      validators: question?.validators?.reduce((acc, id) => {
        const validator = this.validatorMap.get(id);
        if (validator) acc = { ...acc, [id]: validator };
        return acc;
      }, {} as Validator),
      conditions: question?.conditions?.reduce((acc, id) => {
        const condition = this.conditionMap.get(id);
        if (condition) acc = { ...acc, [id]: condition };
        return acc;
      }, {} as Validator),
    };
  }

  payloadToQuestion(payload: QuestionPayload): Question {
    const { id, entry, answerType, answers, validators, conditions } = payload;

    return {
      id,
      entry,
      updated: new Date().valueOf(),
      answerType,
      answers: Object.keys(answers ?? {}),
      validators: Object.keys(validators ?? {}),
      conditions: Object.keys(conditions ?? {}),
    };
  }

  storeQuestionPayload(payload: QuestionPayload): Question {
    const { id, entry, answerType, answers, validators, conditions } = payload;

    const question = {
      id,
      entry,
      updated: new Date().valueOf(),
      answerType,
      answers: addToMap(this.answerMap, answers ?? {}),
      validators: addToMap(this.validatorMap, validators ?? {}),
      conditions: addToMap(this.conditionMap, conditions ?? {}),
    };
    this.questionMap.set(question.id, question);

    return question;
  }

  validators = {
    storeBatch: (): Record<ValidatorId, ValidatorFn> => Object.fromEntries(this.validatorMap.entries()),
    getBatch: () => {},
  };
}
