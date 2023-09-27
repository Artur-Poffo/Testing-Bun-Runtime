import { prismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository";
import { RegisterUserUseCase } from "../register";

export function makeRegisterUserUseCase() {
  const prismaUserRepository = new prismaUsersRepository()
  const registerUserUseCase = new RegisterUserUseCase(prismaUserRepository)

  return registerUserUseCase
}