import { AndOr, Conditions, ConditionTuplet, LeafCondition, QuestionId } from '@cs-forms/shared';

const evaluateTuple = ([op, value]: ConditionTuplet, actual: number): boolean => {
  switch (op) {
    case '==':
      return actual === value;
    case '!=':
      return actual !== value;
    case '<=':
      return actual <= value;
    case '>=':
      return actual >= value;
    case '<':
      return actual < value;
    case '>':
      return actual > value;
  }
};

const operators = (operator: AndOr, results: boolean[]) => {
  switch (operator) {
    case 'and':
      return results.every(Boolean);
    case 'or':
      return results.some(Boolean);
    case 'xand':
      return results.every(Boolean) || results.every(r => !r);
    case 'xor':
      return results.filter(Boolean).length === 1;
  }
};

export function evaluateConditions(condition: Conditions, responses: Record<QuestionId, number>): boolean {
  const evaluateNode = (node: LeafCondition | Conditions): boolean => {
    if ('and' in node || 'or' in node || 'xand' in node || 'xor' in node) {
      const op = Object.keys(node)[0] as AndOr;
      const items = (node as Conditions)[op]!;
      const results = items.map(evaluateNode);

      return operators(op, results);
    } else {
      const key = Object.keys(node)[0];
      const tuple = (node as LeafCondition)[key];
      const actual = responses[key];

      return evaluateTuple(tuple, actual);
    }
  };

  return evaluateNode(condition);
}
