import prisma from "../db/client";
import { remove } from "../services/allergies";

describe('remove', () => {
  it('deletes an allergy from the database', async () => {
    const allergy = await prisma.allergies.create({
      data: {
        id: 0,
        userId: 0,
        name: 'Peanut allergy',
        severity: 'Moderate',
        symptoms: ['Hives', 'Swelling of the lips, face, tongue, and throat', 'Difficulty breathing'],
        image: 'https://example.com/peanut-allergy.jpg',
        highRisk: false,
        createdAt: new Date(),
        comments: [{ text: 'Avoid peanuts and peanut products' }]
      }
    });
    
    await remove(allergy.id);
    
    const result = await prisma.allergies.findFirst({
      where: { id: allergy.id }
    });
    expect(result).toBeNull();
  });
});
