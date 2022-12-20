import prisma from '../db/client';
import { getAll } from '../services/allergies';

describe('getAll', () => {
  it('should return an array of allergies', () => {
    const pageSize = 10;
    const currentPage = 1;

    jest.spyOn(prisma.allergies, 'findMany').mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: 'peanut',
          severity: 'severe',
          symptoms: ['itching', 'swelling', 'trouble breathing'],
          image: 'peanut.png',
          comments: [{ body: 'Be careful with peanut butter' }],
          user: { id: 1, name: 'John Doe' },
          userId: 1,
          highRisk: true,
          createdAt: new Date()
        },
        {
          id: 2,
          name: 'tree nut',
          severity: 'moderate',
          symptoms: ['rash', 'nausea'],
          image: 'tree-nut.png',
          comments: [{ body: 'Watch out for nut-based oils' }],
          user: { id: 1, name: 'John Doe' },
          userId: 1,
          highRisk: false,
          createdAt: new Date()
        },
      ]);
    });


    return getAll({ pageSize, currentPage }).then((allergies) => {
      expect(Array.isArray(allergies)).toBe(true);
      expect(allergies.length).toBe(2);
      expect(allergies[0].name).toBe('peanut');
      expect(allergies[1].name).toBe('tree nut');
    });
  });
});


