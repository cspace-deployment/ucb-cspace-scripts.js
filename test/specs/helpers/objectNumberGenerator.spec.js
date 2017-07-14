import chai from 'chai';
import objectNumberGenerator from '../../../src/helpers/objectNumberGenerator';

chai.should();

describe('objectNumberGenerator', () => {
  it('should generate numbers with the given prefix', () => {
    const prefix = 'PRE';
    const start = 1000;
    const end = 1015;

    Array.from(objectNumberGenerator(prefix, start, end)).forEach((number) => {
      number.startsWith(prefix).should.equal(true);
    });
  });

  it('should generate numbers from the start number to the end number', () => {
    const prefix = 'PRE';
    const start = 123;
    const end = 234;

    const numbers = Array.from(objectNumberGenerator(prefix, start, end));

    numbers.should.have.lengthOf((end - start) + 1);

    numbers[0].should.equal(`${prefix}${start}`);
    numbers[numbers.length - 1].should.equal(`${prefix}${end}`);
  });
});
