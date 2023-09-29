import { prismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository";
import { AuthenticateUserUseCase } from "../authenticate";

export function makeAuthenticateUserUseCase() {
  const prismaUserRepository = new prismaUsersRepository()
  const authenticateUserUseCase = new AuthenticateUserUseCase(prismaUserRepository)

  return authenticateUserUseCase
}