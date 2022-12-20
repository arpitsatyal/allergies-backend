import { validateBody } from '../middlewares/validate';

describe('validateBody', () => {
  it('validates the request body against a given schema and calls the next middleware', () => {
    const schema = {
      validate: jest.fn(() => ({ error: null }))
    };
    
    const req = { body: { foo: 'bar' } };
    
    const res = {};
    const next = jest.fn();
    
    validateBody(schema)(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });
  
  it('returns an error message if the request body is invalid', () => {
    const schema = {
      validate: jest.fn(() => ({ error: { details: [{ message: 'foo is required' }] } }))
    };
    
    const req = { body: {} };
    
    const res = {};
    const next = jest.fn();
    
    validateBody(schema)(req, res, next);
    
    expect(next).toHaveBeenCalledWith({ msg: 'foo is required' });
  });
});
