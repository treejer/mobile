import schema0 from './migrations/schema0';
import schema1 from './migrations/schema1';
import schema2 from './migrations/schema2';
import schema3 from './migrations/schema3';
import schema4 from './migrations/schema4';
import schema5 from './migrations/schema5';
import schema6 from './migrations/schema6';
import schema7 from './migrations/schema7';
import schema8 from './migrations/schema8';
import schema9 from './migrations/schema9';
import schema10 from './migrations/schema10';
import schema11 from './migrations/schema11';
import schema12 from './migrations/schema12';
import schema13 from './migrations/schema13';
import schema14 from './migrations/schema14';
import schema15 from './migrations/schema15';

export const schemas = [
  schema0,
  schema1,
  schema2,
  schema3,
  schema4,
  schema5,
  schema6,
  schema7,
  schema8,
  schema9,
  schema10,
  schema11,
  schema12,
  schema13,
  schema14,
  schema15,
];

export const getSchema = () => schemas[schemas.length - 1];
