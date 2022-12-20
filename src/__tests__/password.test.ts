import { decryptPassword, passwordHash } from "../utils/passwordHash";

const password: string = "akspokop2020########wkdwp???``10o2w02ow02wo20w22s";

describe("password hash", () => {
  it("returns hashed and decrypted password to be equal", async () => {
    const hashed = await passwordHash(password);
    const decrypted = await decryptPassword(hashed);
    expect(password).toEqual(decrypted);
  });

  it("returns hashed and decrypted password to not be equal", async () => {
    const hashed = await passwordHash(password);
    const decrypted = await decryptPassword(hashed);
    expect(password + '.').not.toEqual(decrypted);
  });
});
