import * as FormTypes from '../../core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Constructs age clause without subject (for sentence combiner)
export function constructAlterClause(alter: FormTypes.Alter): Clause | null {
  if (alter === null) return null;
  return createClause(`sei ${alter.toString()} Jahre alt`, 'age', 1);
}
