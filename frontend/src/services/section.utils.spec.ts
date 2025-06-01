/*
import { AnswerTypeEnum, Question } from '@cs-forms/shared';
import { updateQuestion, updateSection } from './section.utils';

describe('updateQuestion', () => {
  it('should update only provided fields', () => {
    const current: Question = {
      id: 'q1',
      entry: 'Old Question?',
      updated: new Date().valueOf(),
      answerType: AnswerTypeEnum.RadioButton,
    };

    const updated = updateQuestion(current, { question: 'New Question?' });

    expect(updated.question).toBe('New Question?');
    expect(updated.answerType).toBe('text');
  });

  it('should preserve the current object if update is empty', () => {
    const current: Question = {
      id: 'q2',
      entry: 'Keep me',
      updated: new Date().valueOf() + 999,
      answerType: AnswerTypeEnum.RadioButton,
    };

    const updated = updateQuestion(current, {});

    expect(updated).toEqual(current);
  });
});

describe('updateSection', () => {
  it('should update the section name and questions', () => {
    const current: Section = {
      id: 's1',
      name: 'Original',
      description: 'Original Desc',
      questions: [
        { id: 'q1', question: 'Old Question?' },
        { id: 'q2', question: 'Another Question' },
      ],
    };

    const updated = updateSection(current, {
      name: 'Updated Section',
      questions: [
        { id: 'q1', question: 'Updated Question?' }, // should merge into existing
        { id: 'q3', question: 'Newly added?' }, // should be added
      ],
    });

    expect(updated.name).toBe('Updated Section');
    expect(updated.questions.length).toBe(3);
    expect(updated.questions.find(q => q.id === 'q1')?.question).toBe('Updated Question?');
    expect(updated.questions.find(q => q.id === 'q3')?.question).toBe('Newly added?');
  });

  it('should leave questions untouched if not provided', () => {
    const current: Section = {
      id: 's2',
      name: 'Section',
      questions: [{ id: 'q1', question: 'Keep me' }],
    };

    const updated = updateSection(current, { name: 'Renamed' });

    expect(updated.questions.length).toBe(1);
    expect(updated.questions[0].question).toBe('Keep me');
  });
});
*/
