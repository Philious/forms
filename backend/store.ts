import {
  addToMap,
  Answer,
  AnswerId,
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

const sectionMap: Map<string, Section> = new Map();
const questionMap: Map<QuestionId, Question> = new Map();
const answerMap: Map<AnswerId, string> = new Map();
const validatorMap: Map<ValidatorId, ValidatorFn> = new Map();
const conditionMap: Map<ConditionId, ConditionFn> = new Map();

export const getAllSections = () => (sectionMap.size > 0 ? [...sectionMap.values()] : []);
export const getSection = (id: SectionId) => sectionMap.get(id) ?? null;

export function addSection(section: SectionPayload) {
  if (!sectionMap.has(section.id)) {
    const questions: QuestionId[] = [];
    Object.values(section.questions).forEach(q => {
      const { id, entry, updated, answerType, answers, validators, conditions } = q;
      const question: Question = { id, entry, answerType, updated };
      if (answers) question.answers = addToMap(answerMap, answers);
      if (validators) question.validators = addToMap(validatorMap, validators);
      if (conditions) question.conditions = addToMap(conditionMap, conditions);
      questions.push(id);
    });
    const { id, name, description, updated } = section;
    sectionMap.set(section.id, { id, name, description, updated, questions });

    return true;
  } else {
    return false;
  }
}

export function updateSection(part: SectionPayload & { id: string }) {
  const current = getSection(part.id);

  if (current) {
    const newSection = Object.fromEntries(
      Object.entries(current).map(([k, v]) => {
        if (k === 'id') return [k, v];
        else if (k === 'questions' && part[k]) {
          return [k, Object.values(part[k]).map(q => updateQuestion(q))];
        } else return [k, part[k as keyof Section] ?? v];
      })
    ) as Section;
    newSection.updated = new Date().valueOf();
    sectionMap.set(newSection.id, newSection);
  } else {
    return false;
  }
}

export function deleteSection(id: SectionId) {
  sectionMap.delete(id);
}

/** Question Content */

/**  Questions */
export const getAllQuestions = () => [...questionMap.values()];
export const getAllQuestionIds = () => getAllQuestions().map(q => q.id);

export function getQuestionPayload(id: QuestionId): QuestionPayload | null {
  const question = questionMap.get(id);
  return question ? questionToQuestionPayload(question) : null;
}

export function questionToQuestionPayload(question: Question): QuestionPayload {
  return {
    id: question.id,
    entry: question.entry,
    updated: question.updated,
    answerType: question.answerType,
    answers: question?.answers?.reduce((acc, id) => {
      const answer = answerMap.get(id);
      if (answer) acc = { ...acc, [id]: answer };
      return acc;
    }, {} as Answer),
    validators: question?.validators?.reduce((acc, id) => {
      const validator = validatorMap.get(id);
      if (validator) acc = { ...acc, [id]: validator };
      return acc;
    }, {} as Validator),
    conditions: question?.conditions?.reduce((acc, id) => {
      const condition = conditionMap.get(id);
      if (condition) acc = { ...acc, [id]: condition };
      return acc;
    }, {} as Validator),
  };
}

export function addQuestion(question: QuestionPayload) {
  const { id, entry, answerType, answers, validators, conditions } = question;

  questionMap.set(id, {
    id,
    entry,
    updated: new Date().valueOf(),
    answerType,
    answers: Object.keys(answers ?? {}),
    validators: Object.keys(validators ?? {}),
    conditions: Object.keys(conditions ?? {}),
  });

  return question;
}

export function updateQuestion(question: QuestionPayload) {
  const currentQuestion = questionMap.get(question.id);
  if (currentQuestion) {
    const updatedQuestion = Object.fromEntries(
      Object.entries(currentQuestion).map(([k, v]) => {
        if (k === 'id') return [k, v];
        else if (k === 'answers' && question[k]) return [k, addToMap(answerMap, question[k])];
        else if (k === 'validators' && question[k]) return [k, addToMap(validatorMap, question[k])];
        else if (k === 'conditions' && question[k]) return [k, addToMap(conditionMap, question[k])];
        return [k, question[k as keyof Question] ?? v];
      })
    ) as Question;
    updatedQuestion.updated = new Date().valueOf();
    questionMap.set(updatedQuestion.id as keyof Question, updatedQuestion);
  }
  return questionMap.get(question.id)!;
}
