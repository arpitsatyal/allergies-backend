import { verifyRefresh } from '../utils/verifyRefreshToken';

describe('verifyRefresh', () => {
  it('verifies a refresh token and returns a boolean indicating its validity', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU5NjA1MzM3MywiZXhwIjoxNTk2MDYwNTczfQ.sT_4bA_1hHAaMjKLZ-NUZYQYZN-Dhk4P4v7-sTb1szs';
    
    jest.mock('jsonwebtoken', () => ({
      verify: jest.fn((_, __, cb) => cb(null, { userId: 1 }))
    }));
    
    const result = verifyRefresh(1, token);
    
    expect(result).toBe(true);
  });
});
