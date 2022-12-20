import { Prisma } from "@prisma/client";
const {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} = Prisma;

export function handleError(e: any) {
    if (e instanceof PrismaClientInitializationError) {
      return({
        msg: "error connecting to the database.",
      });
    } else if (e instanceof PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          return({
            msg: "This email is already registered.",
          });
        default:
          return(e);
      }
    } else if (e instanceof PrismaClientValidationError) {
      return({
        msg: "db validation failed.",
      });
    } else {
      return(e);
    }
}
