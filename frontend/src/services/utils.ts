import { WritableSignal } from '@angular/core';
import {
  Answer,
  AnswerId,
  Condition,
  ConditionId,
  Question,
  QuestionId,
  QuestionPayload,
  Section,
  SectionPayload,
  ValidatorId,
} from '@cs-forms/shared';

export const updateKeyInObject = <T extends object, K extends keyof T>(obj: T | null, key: K, update: T[K]): T | null => {
  console.log(obj, key, update);
  if (obj) {
    if (typeof obj[key] === 'string') obj[key] = update;
    else if (Array.isArray(obj[key]) && Array.isArray(update)) obj[key] = [...new Set([...obj[key], ...update])] as T[K];
  }
  console.log(obj);
  return obj;
};

export const replaceKeyInObject = <T extends object, K extends keyof T>(obj: T | null, key: K, update: T[K]): T | null => {
  if (obj) obj[key] = update;
  return obj;
};

export const arrayToMap = <I, T>(data: unknown): Map<I, T> => {
  if (!Array.isArray(data)) throw new Error('Invalid data: expected array');
  return new Map(data as Array<[I, T]>);
};

export function updateWrapper<T>(writableSignal: WritableSignal<T>) {
  let internal = writableSignal;

  return {
    get: () => internal,

    set: (newValue: T) => {
      internal.set(newValue);
    },

    update: (updater: (current: T) => T) => {
      internal.set(updater(internal()));
    },
  };
}

export const currentSectionPayload = (
  section: Section,
  questionsMap: Map<QuestionId, Question>,
  answersMap: Map<AnswerId, Answer>,
  conditionsMap: Map<ConditionId, Condition>
): SectionPayload => {
  const { id, name, updated, description } = section;

  const questions: QuestionPayload[] = section.questions.reduce((acc, qid) => {
    const question = questionsMap.get(qid);
    if (question) acc.push(currentQuestionPayload(question, answersMap, conditionsMap));

    return acc;
  }, [] as QuestionPayload[]);

  return {
    id,
    name,
    updated,
    description,
    questions,
  };
};

export const currentQuestionPayload = (
  question: Question,
  answersMap: Map<AnswerId, Answer>,
  conditionsMap: Map<ConditionId, Condition>
): QuestionPayload => {
  const answers: Answer =
    question.answers?.reduce((acc, a) => {
      const answer = answersMap.get(a);
      if (answer) return { ...acc, ...answer };
      return acc;
    }, {} as Answer) ?? [];

  const validators: ValidatorId[] = question.validators ?? [];

  const conditions: Condition = question.conditions?.reduce((acc, c) => {
    const conditions = conditionsMap.get(c);
    if (conditions) return { ...acc, ...conditions };
    return acc;
  }, {} as Condition);

  return {
    id: question.id,
    entry: question.entry,
    updated: question.updated,
    answerType: question.answerType,
    answers,
    validators,
    conditions,
  };
};
