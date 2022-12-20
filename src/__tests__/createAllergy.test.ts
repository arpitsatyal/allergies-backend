import prisma from "../db/client";
import { create } from "../services/allergies";

describe("create", () => {
  it("creates an allergy in the database", async () => {
    const body = {
      id: 0,
      name: "Peanuts",
      severity: "Severe",
      symptoms: ["Hives", "Swelling of the lips, face, tongue, and throat"],
      image: "https://example.com/peanuts.jpg",
      highRisk: false,
      createdAt: new Date(),
      comments: [{ text: "Be careful when eating at restaurants" }],
    };
    const userId = 1;

    const allergy = await create(body, userId);

    const createdAllergy = await prisma.allergies.findFirst({
      where: { id: allergy.id },
    });
    expect(createdAllergy).toEqual(allergy);
  });
});
