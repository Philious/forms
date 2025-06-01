import { mergeObject } from './helpers';
import { AnswerTypeEnum } from './types';
describe('updateQuestion', () => {
    it('should update only provided fields', () => {
        const current = {
            id: 'q1',
            entry: 'Old Question?',
            updated: new Date().valueOf(),
            answerType: AnswerTypeEnum.RadioButton,
        };
        const updated = mergeObject(current, { entry: 'New Question?' });
        expect(updated.entry).toBe('New Question?');
        expect(updated.answerType).toBe('text');
    });
    it('should preserve the current object if update is empty', () => {
        const current = {
            id: 'q2',
            entry: 'Keep me',
            updated: new Date().valueOf(),
        };
        const updated = mergeObject(current, {});
        expect(updated).toEqual(current);
    });
});
/*
describe('updateSection', () => {
  it('should update the section name and questions', () => {
    const current: Section = {
      id: 's1',
      name: 'Original',
      updated: new Date().valueOf(),
      description: 'Original Desc',
      questions: ['q1', 'q2'],
    };

    const updated = mergeObject<Section>(current, {
      name: 'Updated Section',
      questions: ['q1', 'q3'],
    });

    expect(updated.name).toBe('Updated Section');
    expect(updated.questions.length).toBe(3);
    expect(updated.questions.find((q: string) => q === 'q1')).toBe('q1');
    expect(updated.questions.find((q: string) => q === 'q3')).toBe('q3');
  });

  it('should leave questions untouched if not provided', () => {
    const current: Section = {
      id: 's2',
      updated: new Date().valueOf(),
      name: 'Section',
      questions: ['q1'],
    };

    const updated = mergeObject(current, { name: 'Renamed' });

    expect(updated.questions.length).toBe(1);
    expect(updated.questions[0]).toBe('Keep me');
    expect(updated.name).toBe('Renamed');
  });
  
});
*/
