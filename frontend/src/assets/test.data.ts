import { AnswerTypeEnum, Question } from '@cs-forms/shared';

type Response = { response: number };

export const testanswers = {
  a0: 'Answer 1',
  a1: 'Answer 2',
  a2: 'Answer 3',
  a3: 'Answer 4',
  a4: 'Answer 5',
  a5: 'Answer 6',
};

export const testquestions: (Question & Response)[] = [
  {
    id: 'id0',
    entry: 'question 1',
    updated: new Date().valueOf(),
    answerType: AnswerTypeEnum.RadioGroup,
    answers: ['a1', 'a2'],
    validators: [],
    conditions: {
      and: [{ id1: ['==', 0] }, { id2: ['==', 1] }],
    },

    response: 0,
  },
  {
    id: 'id1',
    entry: 'question 2',
    updated: new Date().valueOf(),
    answerType: AnswerTypeEnum.RadioGroup,
    answers: ['a3', 'a4'],
    validators: [],
    conditions: {
      or: [{ id0: ['==', 0] }, { id2: ['!=', 0] }],
    },

    response: 0,
  },
  {
    id: 'id2',
    entry: 'question 3',
    updated: new Date().valueOf(),
    answerType: AnswerTypeEnum.RadioGroup,
    answers: ['a5', 'a6'],
    validators: [],
    conditions: {
      xor: [{ id0: ['==', 0] }, { id1: ['==', 1] }],
    },

    response: 1,
  },
  {
    id: 'id3',
    entry: 'question 4',
    updated: new Date().valueOf(),
    answerType: AnswerTypeEnum.RadioGroup,
    answers: ['a6', 'a7'],
    validators: [],
    conditions: {
      and: [
        { id0: ['==', 0] },
        {
          or: [{ id1: ['==', 0] }, { id2: ['==', 1] }],
        },
      ],
    },

    response: 1,
  },
];
