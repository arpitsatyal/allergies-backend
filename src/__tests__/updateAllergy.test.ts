import prisma from "../db/client";
import { update } from "../services/allergies";

describe("update", () => {
  it("updates an allergy in the database", async () => {
    const allergy = await prisma.allergies.create({
      data: {
        id: 0,
        userId: 0,
        highRisk: false,
        createdAt: new Date(),
        name: "Peanuts",
        severity: "Severe",
        symptoms: ["Hives", "Swelling of the lips, face, tongue, and throat"],
        image: "https://example.com/peanuts.jpg",
        comments: [{ text: "Be careful when eating at restaurants" }],
      },
    });

    // Update the allergy
    const body = {
      id: 0,
      userId: 0,
      highRisk: false,
      createdAt: new Date(),
      name: "Peanut allergy",
      severity: "Moderate",
      symptoms: [
        "Hives",
        "Swelling of the lips, face, tongue, and throat",
        "Difficulty breathing",
      ],
      image: "https://example.com/peanut-allergy.jpg",
      comments: [{ text: "Avoid peanuts and peanut products" }],
    };
    const updatedAllergy = await update(allergy.id, body);

    const result = await prisma.allergies.findFirst({
      where: { id: allergy.id },
    });
    expect(result).toEqual(updatedAllergy);
  });
});
