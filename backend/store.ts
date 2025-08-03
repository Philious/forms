import {
  addToMap,
  Answer,
  AnswerId,
  AnswerTypeEnum,
  Question,
  QuestionId,
  QuestionPayload,
  Section,
  SectionId,
  SectionPayload,
  ValidatorFn,
  ValidatorId,
} from '@cs-forms/shared';

const sectionMap: Map<string, Section> = new Map();
sectionMap.set('section-ea5e49d5-d292-4d49-a137-9326a0a60620', {
  id: 'section-ea5e49d5-d292-4d49-a137-9326a0a60620',
  name: 'Section 1',
  description: '',
  updated: 1754081754984,
  questions: ['question-96e61d4d-3f48-4005-9336-cb7cbab77de1'],
});
const questionMap: Map<QuestionId, Question<any>> = new Map();
questionMap.set('question-96e61d4d-3f48-4005-9336-cb7cbab77de1', {
  id: 'question-96e61d4d-3f48-4005-9336-cb7cbab77de1',
  entry: 'Question 1',
  updated: 1754081754963,
  answerType: AnswerTypeEnum.RadioButton,
  answers: [],
  validators: [],
  conditions: {},
});
const answerMap: Map<AnswerId, string> = new Map();
const validatorMap: Map<ValidatorId, ValidatorFn> = new Map();
const conditionMap: Map<string, string> = new Map();

export const getAllSections = () => sectionMap;
export const getSection = (id: SectionId) => sectionMap.get(id) ?? null;

export const addToSectionMap = (section: Section) => {
  sectionMap.set(section.id, section);
  return true;
};

export function addSection(section: SectionPayload) {
  if (!sectionMap.has(section.id)) {
    const questions: QuestionId[] = [];
    Object.values(section.questions).forEach(q => {
      const { id, entry, updated, answerType, answers, validators, conditions } = q;
      const question: Question<string> = {
        id,
        entry,
        answerType,
        updated,
        answers: addToMap(answerMap, answers),
        validators,
        conditions: '',
      };
      questions.push(id);
    });
    const { id, name, description, updated } = section;
    sectionMap.set(section.id, { id, name, description, updated, questions });

    return true;
  } else {
    return false;
  }
}

export function updateSectionPayload(part: SectionPayload & { id: string }) {
  const current = getSection(part.id);

  if (current) {
    const newSection = Object.fromEntries(
      Object.entries(current).map(([k, v]) => {
        if (k === 'id') return [k, v];
        else if (k === 'questions' && part[k]) {
          return [k, [...new Set(Object.values(part[k]).map(q => updateQuestion(q)))]];
        } else return [k, part[k as keyof Section] ?? v];
      })
    ) as Section;
    newSection.updated = new Date().valueOf();
    sectionMap.set(newSection.id, newSection);
  } else {
    return false;
  }
}

export function updateSection(part: Section & { id: string }) {
  const current = getSection(part.id);

  if (current) {
    const updatedSection = Object.fromEntries(
      Object.entries(current).map(([k, v]) => {
        console.log();
        if (k === 'id') return [k, v];
        else if (k === 'questions' && Array.isArray(v)) {
          return [k, [...new Set([...v, ...part.questions])]];
        } else return [k, part[k as keyof Section] ?? v];
      })
    ) as Section;
    updatedSection.updated = new Date().valueOf();
    sectionMap.set(updatedSection.id, updatedSection);
    return true;
  } else {
    return false;
  }
}

export function deleteSection(id: SectionId) {
  sectionMap.delete(id);
}

/** Question Content */

/**  Questions */
export const getAllQuestions = (): Map<QuestionId, Question> => questionMap;

export function getQuestionPayload(id: QuestionId): QuestionPayload | null {
  const question = questionMap.get(id);
  return question ? questionToQuestionPayload(question) : null;
}

export const addToQuestionMap = (question: Question) => questionMap.set(question.id, question);

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
    validators: question?.validators,
    conditions: '',
  };
}

export function addQuestion(question: QuestionPayload) {
  const { id, entry, answerType, answers, validators } = question;

  questionMap.set(id, {
    id,
    entry,
    updated: new Date().valueOf(),
    answerType,
    answers: Object.keys(answers ?? {}),
    validators: Object.keys(validators ?? {}),
    conditions: '',
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
        else if (k === 'validators' && question[k]) return [k, question[k]];
        return [k, question[k as keyof Question] ?? v];
      })
    ) as Question;
    updatedQuestion.updated = new Date().valueOf();
    questionMap.set(updatedQuestion.id as keyof Question, updatedQuestion);
  }
  return questionMap.get(question.id)!;
}

export const getAllAnswers = (): Map<AnswerId, string> => answerMap;
