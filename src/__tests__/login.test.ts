import prisma from "../db/client";
import { login } from '../services/auth';

describe('login', () => {
  it('should return an access token, refresh token, and user object if the email and password are valid', async () => {
    const body = { email: 'test@example.com', password: 'password' };
    const expectedResponse = {
      data: {
        accessToken: '<access-token>',
        refreshToken: '<refresh-token>',
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'user',
          password: 'password'
        },
      },
      message: 'Logged in successfully...',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      name: 'arpit',
      role: 'user',
      email: 'test@example.com',
      password: 'hashed-password',
    });
    
    const result = await login(body);
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error if the email is not provided', async () => {
    const body = { password: 'password' };

    try {
      await login(body);
      fail('login should have thrown an error');
    } catch (error) {
      expect(error).toEqual({ msg: 'please enter email and password.' });
    }
  });

  it('should return an error if the password is not provided', async () => {
    const body = { email: 'test@example.com' };

    try {
      await login(body);
      fail('login should have thrown an error');
    } catch (error) {
      expect(error).toEqual({ msg: 'please enter email and password.' });
    }
  });

  it('should return an error if the email is not found in the database', async () => {
    const body = { email: 'test@example.com', password: 'password' };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

    try {
      await login(body);
      fail('login should have thrown an error');
    } catch (error) {
      expect(error).toEqual({ msg: 'invalid email or password' });
    }
  });

