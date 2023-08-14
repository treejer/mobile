import {sortByDate} from 'utilities/helpers/sortByDate';

describe('sortByDate util', () => {
  it('sortByDate util should be defined', () => {
    expect(sortByDate).toBeDefined();
    expect(typeof sortByDate).toBe('function');
  });

  it('sortByDate should sort from newer to older', () => {
    const olderDate = new Date().setFullYear(2022);
    const newerDate = new Date();
    const array = [
      {
        date: olderDate,
      },
      {
        date: newerDate,
      },
    ];
    const expectedArray = [
      {
        date: newerDate,
      },
      {
        date: olderDate,
      },
    ];
    expect(sortByDate(array, 'date')).toEqual(expectedArray);
  });
});
