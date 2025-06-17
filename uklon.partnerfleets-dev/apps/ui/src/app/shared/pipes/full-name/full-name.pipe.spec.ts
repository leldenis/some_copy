import { FullNamePipe } from './full-name.pipe';

describe('FullNamePipe', () => {
  let pipe: FullNamePipe;

  beforeEach(() => {
    pipe = new FullNamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return fullName if first_name and last_name are present', () => {
    const model = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const result = pipe.transform(model);
    expect(result).toMatch('Doe John');
  });

  it('should return empty string if not first_name and last_name are present', () => {
    const model = {};
    const result = pipe.transform(model);
    expect(result).toMatch('');
  });

  it('should return lastName if only last_name is present', () => {
    const model = { last_name: 'Doe' };
    const result = pipe.transform(model);
    expect(result).toMatch('Doe');
  });

  it('should return firstName if only first_name is present', () => {
    const model = { first_name: 'John' };
    const result = pipe.transform(model);
    expect(result).toMatch('John');
  });

  it('should return fullName abbreviation if first_name and last_name are present', () => {
    const model = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const result = pipe.transform(model, true);
    expect(result).toMatch('D J');
  });

  it('should return lastName abbreviation if only last_name is present', () => {
    const model = { last_name: 'Doe' };
    const result = pipe.transform(model, true);
    expect(result).toMatch('D');
  });

  it('should return firstName abbreviation if only first_name is present', () => {
    const model = { first_name: 'John' };
    const result = pipe.transform(model, true);
    expect(result).toMatch('J');
  });
});
