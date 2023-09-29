import { prismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../get-profile";

export function makeGetUserProfileUseCase() {
  const prismaUserRepository = new prismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUserRepository)

  return getUserProfileUseCase
}